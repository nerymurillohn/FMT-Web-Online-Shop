import { OrganizationJsonLd, ProductJsonLd } from 'next-seo';

export function JsonLd() {
  return (
    <>
      <OrganizationJsonLd
        type="Organization"
        logo="https://forestalmt.com/logo.png"
        legalName="Forestal Murillo Tejada"
        name="Forestal MT"
        address={{
          streetAddress: '123 Forestal Lane',
          addressLocality: 'San Pedro Sula',
          addressRegion: 'Cortés',
          postalCode: '21101',
          addressCountry: 'HN',
        }}
        contactPoint={[
          {
            telephone: '+504-0000-0000',
            contactType: 'customer service',
          },
        ]}
        sameAs={[
          'https://www.facebook.com/forestalmt',
          'https://www.instagram.com/forestalmt',
          'https://www.linkedin.com/company/forestalmt',
        ]}
        url="https://forestalmt.com/"
      />
    </>
  );
}
