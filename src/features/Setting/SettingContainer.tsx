'use client';

import { useResponsive } from 'antd-style';
import { PropsWithChildren, ReactNode, memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

interface SettingContainerProps extends FlexboxProps {
  addonAfter?: ReactNode;
  addonBefore?: ReactNode;

  maxWidth?: number;
}
const SettingContainer = memo<PropsWithChildren<SettingContainerProps>>(
  ({
    id = 'lobe-desktop-scroll-container',
    maxWidth = 1024,
    children,
    addonAfter,
    addonBefore,
    style,
    ...rest
  }) => {
    const { mobile = false } = useResponsive();
    return (
      <Flexbox
        align={'center'}
        height={'100%'}
        id={id}
        paddingBlock={mobile ? undefined : 32}
        style={{ overflowX: 'hidden', overflowY: 'auto', ...style }}
        width={'100%'}
        {...rest}
      >
        {addonBefore}
        <Flexbox
          gap={64}
          paddingInline={mobile ? undefined : 24}
          style={{
            maxWidth,
          }}
          width={'100%'}
        >
          {children}
        </Flexbox>
        {addonAfter}
      </Flexbox>
    );
  },
);

export default SettingContainer;
