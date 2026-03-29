import { getBlogPermalink, getPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Features', href: '#features' },
    { text: 'So funktioniert es', href: '#how-it-works' },
    { text: 'Preise', href: getPermalink('/preise') },
    { text: 'Blog', href: getBlogPermalink() }
  ],
  actions: [{ text: 'Jetzt kaufen — €39', href: getPermalink('/preise') }]
};

export const footerData = {
  links: [
    {
      title: 'Produkt',
      links: [
        { text: 'Features', href: '#features' },
        { text: 'Preise', href: getPermalink('/preise') },
        { text: 'Blog', href: getBlogPermalink() }
      ]
    },
    {
      title: 'Ressourcen',
      links: [
        { text: 'Bewerbungsschreiben', href: getPermalink('/bewerbungsschreiben') },
        { text: 'Lebenslauf erstellen', href: getPermalink('/lebenslauf-erstellen') },
        { text: 'KI-Bewerbung', href: getPermalink('/ki-bewerbung') }
      ]
    },
    {
      title: 'Rechtliches',
      links: [
        { text: 'Impressum', href: getPermalink('/impressum') },
        { text: 'Datenschutz', href: getPermalink('/datenschutz') }
      ]
    }
  ],
  secondaryLinks: [
    { text: 'Impressum', href: getPermalink('/impressum') },
    { text: 'Datenschutz', href: getPermalink('/datenschutz') }
  ],
  socialLinks: [{ ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/MarkusOdenthal' }]
};
