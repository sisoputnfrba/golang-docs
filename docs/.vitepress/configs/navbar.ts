import { DefaultTheme } from 'vitepress';

export const navbar: DefaultTheme.NavItem[] = [
  {
    text: 'Blog',
    link: 'https://faq.utnso.com.ar/blog'
  },
  {
    text: 'Guías',
    link: '/guias/',
    activeMatch: '/(primeros-pasos|guias)/',
  },
  {
    text: 'Consultas',
    link: '/consultas',
  },
  {
    text: '¿Quiénes somos?',
    link: 'https://faq.utnso.com.ar/docs/quienes-somos',
  },
  {
    text: 'Inscripciones',
    link: 'https://faq.utnso.com.ar/inscripciones'
  },
]
