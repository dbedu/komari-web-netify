import { Flex, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';

const Footer = () => {
  //const currentYear = new Date().getFullYear();
  
  // 格式化 build 时间
  const formatBuildTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Shanghai'
    }) + ' (GMT+8)';
  };

  const buildTime = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : null;
  const [versionInfo, setVersionInfo] = useState<{ hash: string; version: string } | null>(null);

  useEffect(() => {
    const fetchVersionInfo = async () => {
      try {
        const response = await fetch('/api/version');
        const data = await response.json();
        if (data.status === 'success') {
          setVersionInfo({ hash: data['data'].hash.slice(0,7), version: data['data'].version });
        }
      } catch (error) {
        console.error('Failed to fetch version info:', error);
      }
    };

    fetchVersionInfo();
  }, []);
  return (
    <footer
      className='footer mt-auto bg-background/80 backdrop-blur-xl border-t border-border/20 shadow-lg'
    >
      <div className="px-6 py-8">
        <Flex
          direction={{ initial: 'column', md: 'row' }}
          justify="between"
          align={{ initial: 'center', md: 'start' }}
          gap="6"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {/* Main Content */}
          <Flex direction="column" gap="3" align={{ initial: 'center', md: 'start' }}>
            <Text 
              size="3" 
              weight="medium"
              className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent"
            >
              Powered by Komari Monitor
            </Text>
            
            <Flex direction="column" gap="1" align={{ initial: 'center', md: 'start' }}>
              {buildTime && (
                <Text size="2" color="gray" className="opacity-75 transition-opacity hover:opacity-100">
                  Build: {formatBuildTime(buildTime)}
                </Text>
              )}
              {versionInfo && (
                <Text size="2" color="gray" className="opacity-75 transition-opacity hover:opacity-100 font-mono">
                  v{versionInfo.version} ({versionInfo.hash})
                </Text>
              )}
            </Flex>
          </Flex>

          {/* Additional Info Section */}
          <Flex direction="column" gap="2" align={{ initial: 'center', md: 'end' }}>
            <Text size="2" color="gray" className="opacity-60">
              © {new Date().getFullYear()} Komari Monitor
            </Text>
            <Text size="1" color="gray" className="opacity-50">
              Crafted with precision
            </Text>
          </Flex>
        </Flex>
      </div>
    </footer>
  );
};

export default Footer;

