// pages/privacy-policy.js
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const PrivacyPolicy = () => {
  const { t } = useTranslation('privacy');

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-100 min-h-[calc(100vh-3rem)]">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-600">{t('title')}</h1>
        {/* Language Switcher can go here if needed */}
      </div>
      <p className="text-gray-700 text-lg leading-7 mb-6">{t('intro')}</p>

      {t('content', { returnObjects: true }).map((section, index) => (
        <div key={index} className="bg-white p-6 mb-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-blue-500 mb-2">
            {section.heading}
          </h2>
          <p className="text-gray-600 leading-7">{section.text}</p>
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
