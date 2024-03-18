import { ExitToAppRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { Button, Icon, Modal, ThemeModeToggleButton } from '@/components';
import { useGetUuidRoom } from '@/hooks/Api/useRooms';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import useModal from '@/hooks/useModal';
import { ROOM_ROLE } from '@/pages/RoomPage/RoomPage.consts';
import { ButtonsWrapper, Title } from '@/pages/RoomPage/RoomPage.style';
import { PATH } from '@/routes/path';
import useMessageStore from '@/store/MessageStore';
import useRoomStore from '@/store/RoomStore';
import { RoleType } from '@/types/room';

interface RoomButtonsProps {
  role: RoleType;
  className: string;
  onClick: () => void;
}

export default function RoomHeaderButtons({
  role,
  className,
  onClick,
}: RoomButtonsProps) {
  const { theme } = useCustomTheme();
  const { roomData } = useRoomStore();

  const { closeModal, openModal, isOpen } = useModal();
  const { disconnect } = useMessageStore();
  const navigate = useNavigate();

  const { refetch } = useGetUuidRoom(roomData.roomShortUuid);

  const handleExitRoom = () => {
    // disconnect 시 서버에서 방장 자동 변경
    disconnect();
    refetch();

    navigate(PATH.HOME);
  };

  return (
    <>
      <ButtonsWrapper className={className}>
        {role === ROOM_ROLE.HOST && (
          <Button
            className="changeRoomInfo"
            fontSize="1.6rem"
            onClick={onClick}
          >
            방 정보 수정
          </Button>
        )}
        <ThemeModeToggleButton />
        <Icon
          className="exitRoom"
          background={true}
          onClick={openModal}
        >
          <ExitToAppRounded fontSize="large" />
        </Icon>
      </ButtonsWrapper>
      <Modal
        mode="confirm"
        isOpen={isOpen}
        onClose={closeModal}
        width="40rem"
        height="20rem"
      >
        <Title>정말로 나가시겠습니까?</Title>
        <ButtonsWrapper>
          <Button onClick={handleExitRoom}>확인</Button>
          <Button
            onClick={closeModal}
            backgroundColor={theme.color.gray_20}
          >
            취소
          </Button>
        </ButtonsWrapper>
      </Modal>
    </>
  );
}
