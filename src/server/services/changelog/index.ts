import dayjs from 'dayjs';
import matter from 'gray-matter';
import { markdownToTxt } from 'markdown-to-txt';
import semver from 'semver';
import urlJoin from 'url-join';

import { Locales } from '@/locales/resources';
import { ChangelogIndexItem } from '@/types/changelog';

const BASE_URL = 'https://raw.githubusercontent.com';
const LAST_MODIFIED = new Date().toISOString();

const docCdnPrefix = process.env.DOC_S3_PUBLIC_DOMAIN || '';

export interface ChangelogConfig {
  branch: string;
  cdnPath: string;
  changelogPath: string;
  docsPath: string;
  majorVersion: number;
  repo: string;
  type: 'cloud' | 'community';
  user: string;
}

export class ChangelogService {
  cdnUrls: {
    [key: string]: string;
  } = {};
  config: ChangelogConfig = {
    branch: process.env.DOCS_BRANCH || 'main',
    cdnPath: 'docs/.cdn.cache.json',
    changelogPath: 'changelog',
    docsPath: 'docs/changelog',
    majorVersion: 1,
    repo: 'lobe-chat',
    type: 'cloud',
    user: 'lobehub',
  };

  async getLatestChangelogId() {
    const index = await this.getChangelogIndex();
    return index[0]?.id;
  }

  async getChangelogIndex(): Promise<ChangelogIndexItem[]> {
    try {
      const url = this.genUrl(urlJoin(this.config.docsPath, 'index.json'));

      const res = await fetch(url);

      const data = await res.json();

      return this.mergeChangelogs(data.cloud, data.community).slice(0, 5);
    } catch (e) {
      const cause = (e as Error).cause as { code: string };
      if (cause.code.includes('ETIMEDOUT')) {
        console.warn(
          '[ChangelogFetchTimeout] fail to fetch changelog lists due to network timeout. Please check your network connection.',
        );
      } else {
        console.error('Error getting changelog lists:', e);
      }

      return [];
    }
  }

  async getIndexItemById(id: string) {
    const index = await this.getChangelogIndex();
    return index.find((item) => item.id === id);
  }

  async getPostById(id: string, options?: { locale?: Locales }) {
    await this.cdnInit();
    try {
      const post = await this.getIndexItemById(id);

      const filename = options?.locale === 'en-US' ? `${id}.mdx` : `${id}.zh-CN.mdx`;
      const url = this.genUrl(urlJoin(this.config.docsPath, filename));

      const response = await fetch(url);
      const text = await response.text();
      const { data, content } = matter(text);

      const regex = /^#\s(.+)/;
      const match = regex.exec(content.trim());
      const matches = content.trim().split(regex);

      let description: string;

      if (matches[2]) {
        description = matches[2] ? matches[2].trim() : '';
      } else {
        description = matches[1] ? matches[1].trim() : '';
      }

      if (docCdnPrefix) {
        const images = this.extractHttpsLinks(content);
        for (const url of images) {
          const cdnUrl = this.replaceCdnUrl(url);
          if (cdnUrl && url !== cdnUrl) {
            description = description.replaceAll(url, cdnUrl);
          }
        }
      }

      return {
        date: post?.date
          ? new Date(post.date)
          : data?.date
            ? new Date(data.date)
            : new Date(LAST_MODIFIED),
        description: markdownToTxt(description.replaceAll('\n', '').replaceAll('  ', ' ')).slice(
          0,
          160,
        ),
        image: post?.image ? this.replaceCdnUrl(post.image) : undefined,
        tags: ['changelog'],
        title: match ? match[1] : '',
        ...data,
        content: description,
        rawTitle: match ? match[1] : '',
      };
    } catch {
      console.error('Error getting changlog post by id', id);
      return false as any;
    }
  }

  private mergeChangelogs(
    cloud: ChangelogIndexItem[],
    community: ChangelogIndexItem[],
  ): ChangelogIndexItem[] {
    if (this.config.type === 'community') {
      return community;
    }

    const merged = [...community];

    for (const cloudItem of cloud) {
      const index = merged.findIndex((item) => item.id === cloudItem.id);
      if (index !== -1) {
        merged[index] = cloudItem;
      } else {
        merged.push(cloudItem);
      }
    }

    return merged
      .map((item) => ({
        ...item,
        date: dayjs(item.date).format('YYYY-MM-DD'),
        versionRange: this.formatVersionRange(item.versionRange),
      }))
      .sort((a, b) => semver.rcompare(a.versionRange[0], b.versionRange[0]));
  }

  private formatVersionRange(range: string[]): string[] {
    if (range.length === 1) {
      return range;
    }

    const [v1, v2]: any = range.map((v) => semver.parse(v)?.toString());

    const minVersion = semver.lt(v1, v2) ? v1 : v2;
    const maxVersion = semver.gt(v1, v2) ? v1 : v2;

    return [maxVersion, minVersion];
  }

  private genUrl(path: string) {
    return urlJoin(BASE_URL, this.config.user, this.config.repo, this.config.branch, path);
  }

  private extractHttpsLinks(text: string) {
    const regex = /https:\/\/[^\s"')>]+/g;
    const links = text.match(regex);
    return links || [];
  }

  private async cdnInit() {
    if (!docCdnPrefix) return;
    if (Object.keys(this.cdnUrls).length === 0) {
      try {
        const url = this.genUrl(this.config.cdnPath);
        const res = await fetch(url);
        const data = await res.json();
        if (data) {
          this.cdnUrls = data;
        }
      } catch (error) {
        console.error('Error getting changelog cdn cache:', error);
      }
    }
  }

  private replaceCdnUrl(url: string) {
    if (!docCdnPrefix || !this.cdnUrls?.[url]) {
      return url;
    }
    return urlJoin(docCdnPrefix, this.cdnUrls[url]);
  }
}
