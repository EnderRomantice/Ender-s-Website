export const about_profile = {
  name: "Ender",
  working: "XTrace",
  job: "Full-Stack Developer",
  live: "Chengdu",
  email: "enderromantic@gmail.com",
  tech: "Astro",
};

export const about_lines = [
  `Hi, I'm ${about_profile.name}`,
  `${about_profile.job}${about_profile.working ? ` @ ${about_profile.working}` : ""}`,
  `I live in ${about_profile.live}. `,
  `If you want to coffee with me`,
  `please contact me :)`,
  `Gmail: ${about_profile.email}`,
];

export const about_animation = {
  duration: 0.3,
  stagger: 0.05,
  delay_start: 0,
};
