// pages/privacy-policy.js
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const PrivacyPolicy = () => {
  const { t } = useTranslation('privacy');

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>{t('title')}</h1>
      <p>{t('intro')}</p>
      {t('content', { returnObjects: true }).map((section, index) => (
        <div key={index}>
          <h2>{section.heading}</h2>
          <p>{section.text}</p>
        </div>
      ))}
    </div>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['privacy'])),
    },
  };
}

export default PrivacyPolicy;
