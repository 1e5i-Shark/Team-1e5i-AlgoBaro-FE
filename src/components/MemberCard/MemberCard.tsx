import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

import { Icon, Menu } from '@/components';
import { Avatar } from '@/components/Common/Avatar';
import { MenuListProps, MenuText } from '@/components/Common/Menu/MenuText';
import { ROOM_ROLE } from '@/pages/RoomPage/RoomPage.consts';
import { MemberType, RoleType } from '@/types/room';

import * as S from './MemberCard.style';
import StatusTag from './StatusTag';

interface MemberProps
  extends Partial<
    Pick<MemberType, 'nickname' | 'profileImage' | 'role' | 'ready'>
  > {
  myRole: RoleType;
  memberId: number;
  onMenuClick: (menu: string, memberId: number) => void;
}

export default function MemberCard({
  myRole,
  memberId,
  nickname,
  profileImage,
  role,
  ready,
  onMenuClick,
}: MemberProps) {
  const menuList: MenuListProps[] = [
    {
      id: 1,
      text: MenuText.TransferHost,
      onClick: () => onMenuClick(MenuText.TransferHost, memberId),
    },
    {
      id: 2,
      text: MenuText.KickOut,
      onClick: () => onMenuClick(MenuText.KickOut, memberId),
    },
  ];

  return (
    <S.CardWrapper>
      {myRole === ROOM_ROLE.HOST && role === ROOM_ROLE.MEMBER && (
        <S.MenuWrapper>
          <Menu
            menuList={menuList}
            className="menu"
          >
            <Icon>
              <MoreVertRoundedIcon />
            </Icon>
          </Menu>
        </S.MenuWrapper>
      )}
      <Avatar
        src={profileImage}
        size="M"
      />
      <S.NameWrapper>{nickname}</S.NameWrapper>
      <StatusTag
        role={role ?? ROOM_ROLE.MEMBER}
        ready={ready ?? false}
      />
    </S.CardWrapper>
  );
}
