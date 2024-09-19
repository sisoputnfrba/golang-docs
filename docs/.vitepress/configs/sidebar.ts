import { DefaultTheme } from 'vitepress';

export const sidebar: DefaultTheme.Sidebar = [
  {
    text: 'Recursos',
    items: [
      {
        text: 'Máquinas virtuales',
        link: 'https://faq.utnso.com.ar/docs/recursos/vms',
      },
      {
        text: 'Documentación de Go',
        link: 'https://pkg.go.dev',
      },
      {
        text: 'Tour of Go',
        link: 'https://go.dev/tour',
      },
      {
        text: 'Enunciado del TP',
        link: 'https://faq.utnso.com.ar/tp-go'
      },
      {
        text: 'Documento de Pruebas',
        link: 'https://faq.utnso.com.ar/pruebas-go',
      },
      {
        text: 'TPs Anteriores',
        link: 'https://faq.utnso.com.ar/docs/recursos/tps-anteriores',
      }
    ]
  },
  {
    text: 'Primeros pasos',
    collapsed: true,
    items: [
      {
        text: 'Introducción al Trabajo Práctico',
        link: 'https://faq.utnso.com.ar/docs/primeros-pasos/'
      },
      {
        text: '¿Dónde me anoto?',
        link: 'https://faq.utnso.com.ar/docs/primeros-pasos/donde-me-anoto'
      },
      {
        text: 'Normas del Trabajo Práctico',
        link: 'https://faq.utnso.com.ar/docs/primeros-pasos/normas-tp'
      },
      {
        text: 'Conseguir un entorno Linux',
        link: 'https://faq.utnso.com.ar/docs/primeros-pasos/entorno-linux'
      },
      {
        text: '¿Qué es Golang?',
        link: '/primeros-pasos/lenguaje-golang'
      },
      {
        text: 'Git para el Trabajo Práctico',
        link: 'https://faq.utnso.com.ar/docs/guias/consola/git'
      },
      {
        text: 'Trabajo Práctico 0',
        link: '/primeros-pasos/tp0'
      },
    ],
  },
  {
    text: 'Consola de Linux y Git',
    collapsed: true,
    items: [
      {
        text: 'Mario Bash',
        link: 'https://faq.utnso.com.ar/mariobash'
      },
      {
        text: 'Guía de uso de Bash',
        link: 'https://faq.utnso.com.ar/docs/guias/consola/bash'
      },
      {
        text: 'Rutas Relativas y Absolutas',
        link: 'https://faq.utnso.com.ar/docs/guias/consola/rutas'
      },
      {
        text: 'Learn Git Branching',
        link: 'https://learngitbranching.js.org/?locale=es_AR'
      },
    ],
  },
  {
    text: 'Golang',
    collapsed: true,
    items: [
      {
        text: 'Introducción',
        link: '/guias/programacion/introduction',
      },
      {
        text: 'Variables y Funciones',
        link: '/guias/programacion/variables-functions'
      },
      {
        text: 'Operadores',
        link: '/guias/programacion/operators'
      },
      {
        text: 'Sentencias',
        link: '/guias/programacion/sentences'
      },
      {
        text: 'Rutinas o ¿Hilos?',
        link: '/guias/programacion/threads'
      },
      {
        text: 'Sincronización',
        link: '/guias/programacion/synchronization'
      },
      {
        text: 'Protocolo HTTP',
        link: '/guias/programacion/http-protocol'
      },
      {
        text: 'Bibliotecas - func compartidas',
        link: '/guias/programacion/libraries'
      },
      {
        text: 'Manejo de archivos',
        link: '/guias/programacion/file-management'
      },
      {
        text: 'Estructura de proyecto',
        link: '/guias/programacion/objects'
      },
      {
        text: 'Logging',
        link: '/guias/programacion/logging'
      }
    ],
  },
  {
    text: 'Herramientas útiles',
    collapsed: true,
    items: [
      {
        text: 'Estructura de proyecto',
        link: '/guias/herramientas/projects'
      },
      {
        text: '¿Qué es un Socket?',
        link: '/guias/herramientas/sockets'
      },
      {
        text: 'FUSE',
        link: '/guias/herramientas/fuse'
      }
    ],
  },
]
