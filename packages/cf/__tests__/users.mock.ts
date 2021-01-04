export const users = [
  {
    name: 'Deep Beate',
    followers: 6062,
    dateOfBirth: '1988-11-21',
  },
  {
    name: 'Julinha Quinton',
    followers: 4137,
    dateOfBirth: '1992-11-18',
  },
  {
    name: 'Antonia Łucjan',
    followers: 1182,
    dateOfBirth: '1983-08-09',
  },
  {
    name: 'Giusy Zaïre',
    followers: 112,
    dateOfBirth: '2000-06-14',
  },
  {
    name: 'Elviira Hvare Khshaeta',
    followers: 2702,
    dateOfBirth: '1999-07-12',
  },
  {
    name: 'Theron Nthanda',
    followers: 1482,
    dateOfBirth: '1981-01-09',
  },
];
export const usersByNameAsc = [...users.sort((a, b) => a.name.localeCompare(b.name))];
export const usersByNameDesc = [...usersByNameAsc].reverse();
export const usersByFollowersAsc = [...users.sort((a, b) => a.followers - b.followers)];
export const usersByFollowersDesc = [...usersByFollowersAsc].reverse();
export const usersByDateOfBirthAsc = [
  ...users.sort((a, b) => Date.parse(a.dateOfBirth) - Date.parse(b.dateOfBirth)),
];
export const usersByDateOfBirthDesc = [...usersByDateOfBirthAsc].reverse();
