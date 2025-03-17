type Props = {
  toggled: boolean;
  onToggle: (toggled: boolean, e: React.MouseEvent<HTMLButtonElement>) => void;
  onIcon: React.ReactNode;
  offIcon: React.ReactNode;
  title: string;
};
export default function ToggleButton({toggled, onToggle, onIcon, offIcon, title} : Props) {

  return (
    <button aria-label={title}   onClick={(e) => onToggle(!toggled, e)}>{toggled? onIcon:offIcon}</button>
  );
}