import { PropsWithChildren } from 'react';
import { Flexbox } from 'react-layout-kit';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Flexbox gap={8} height={'100%'} padding={'8px 8px 0'} style={{ overflow: 'hidden' }}>
      <Flexbox
        height={'100%'}
        style={{ marginInline: -8, overflow: 'hidden', position: 'relative' }}
        width={'calc(100% + 16px)'}
      >
        {children}
      </Flexbox>
    </Flexbox>
  );
};

export default Layout;
