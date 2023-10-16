import { Menu } from './Menu';

interface Props {
  children: React.ReactNode;
  displayMenu?: boolean;
}

export const Layout = ({ children, displayMenu = true }: Props) => (
  <div className="min-h-screen flex justify-center items-center bg-gray-100 py-4">
    {children}
    {displayMenu && <Menu />}
  </div>
);
