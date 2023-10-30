<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  { name: 'Matías García Isaia', github: 'mgarciaisaia' },
  { name: 'Esteban Masoero', github: 'esigma5' },
  { name: 'Damian Facchini', github: 'iago64' },
  { name: 'Nahuel Mazzeo', github: 'nahuemazzeo' },
  { name: 'Federico Pablos', github: 'fpablos' },
  { name: 'Adriano Filgueira', github: 'afilgueira' },
  { name: 'Nicolas Coen', github: 'ncoen97' },
  { name: 'Luis Cannavó', github: 'luchotc' },
  { name: 'Leandro Carbajales', github: 'LeandroCarbajales' },
  { name: 'Mauro Corvaro', github: 'CMauro96' },
  { name: 'Federico Cardoso', github: 'F-Cardoso' },
  { name: 'Julian Schiffer', github: 'Zheoden' },
  { name: 'Juan Mesaglio', github: 'mesaglio' },
  { name: 'Lucila Melamed', github: 'lumelamed' },
  { name: 'Karen Manrique', github: 'karengrams' },
  { name: 'Dario Kozicki', github: 'dariokozicki' },
  { name: 'Federico Medina', github: 'FredeHG' },
  { name: 'Agustin Ranieri', github: 'RaniAgus' },
  { name: 'Marcos Infantino', github: 'MarcosInfantino' },
  { name: 'Sofia Azcoaga', github: 'sazcoaga' },
  { name: 'Matias Rosbaco', github: 'MatiasRosbaco' },
].map((member) => ({
  avatar: `https://www.github.com/${member.github}.png`,
  name: member.name,
  title: `${member.github}`,
  links: [{ icon: 'github', link: `https://github.com/${member.github}` }]
}))

</script>

# ¿Quiénes somos?

<VPTeamMembers size="small" :members="members" />
