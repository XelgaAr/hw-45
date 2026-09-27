const paths = {
  plus: 'M12 5v14M5 12h14',
  check: 'm5 12 4 4L19 6',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  clock: 'M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  edit: 'm16 3 5 5-12 12H4v-5zM14 5l5 5',
  trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7',
  close: 'm6 6 12 12M6 18 18 6',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  cloud: 'M7 18a5 5 0 1 1 1-10 6 6 0 0 1 11 3 3.5 3.5 0 0 1-1 7M12 11v10m-4-4 4 4 4-4',
  leaf: 'M20 3C8 2 2 8 5 16s16 4 15-13ZM5 21 16 9',
};
export default function Icon({ name, size = 20, ...props }) {
  return <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  ><path d={paths[name] ?? paths.grid} /></svg>;
}
