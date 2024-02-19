import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MouseEvent, ReactElement, useState } from 'react';
import { useTheme } from 'styled-components';

/**
 * Menu 컴포넌트
 * @param [children] - 아이콘 등의 버튼을 입력 받습니다.
 * @param [menuList] - 메뉴바에 들어갈 옵션의 이름과 클릭 이벤트를 받습니다.
 * @param [fontSize] - 메뉴바 텍스트의 크기를 받습니다.
 * @param [color] - 메뉴바 텍스트의 색상을 받습니다.
 * @param [shadow] - 추가하여 그림자 효과를 부여할 수 있습니다.
 */

interface BasicMenuProps {
  children: ReactElement;
  menuList: {
    text: string;
    onClick: (event: MouseEvent<HTMLElement>) => void;
  }[];
  fontSize?: string;
  color?: string;
  shadow?: string;
}

export default function MenuBar({
  children,
  menuList,
  fontSize = '1rem',
  color = 'black',
  shadow = '',
}: BasicMenuProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <button onClick={handleClick}>{children}</button>

      <Menu
        id="basic-menu"
        slotProps={{
          paper: {
            sx: {
              bgcolor: theme.color.gray_30,
              boxShadow: shadow || 'none',
            },
          },
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {menuList.map((menu, index) => {
          return (
            <MenuItem
              sx={{
                fontSize,
                color,
              }}
              key={menu.text + index}
              onClick={event => {
                menu.onClick(event);
                handleClose();
              }}
            >
              {menu.text}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
