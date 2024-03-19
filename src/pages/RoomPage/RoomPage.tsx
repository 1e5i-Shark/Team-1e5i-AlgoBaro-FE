import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Chat, Spinner } from '@/components';
import { SOCKET_TYPE } from '@/constants/socket';
import { useMyInfo } from '@/hooks/Api/useMembers';
import { useGetUuidRoom } from '@/hooks/Api/useRooms';
import { PATH } from '@/routes/path';
import useMessageStore from '@/store/MessageStore';
import useRoomStore from '@/store/RoomStore';
import useTimerStore from '@/store/TimerStore';

import { findMyRoomData } from './findMyRoomData';
import MemberList from './MemberList/MemberList';
import RoomHeader from './RoomHeader/RoomHeader';
import * as S from './RoomPage.style';
import TestInfo from './TestInfo/TestInfo';

export default function RoomPage() {
  const {
    roomData,
    setMyRoomData,
    setRoomData,
    reset: resetRoom,
  } = useRoomStore();
  const {
    client,
    subscription,
    receiveLogs,
    listeners,
    connect,
    disconnect,
    reset: resetMessage,
  } = useMessageStore();
  const { setEndDateIOSString } = useTimerStore(state => state);

  const { data: myInfo, refetch: refetchMyInfo } = useMyInfo();

  const { roomShortUuid } = useParams();
  const navigate = useNavigate();

  if (!roomShortUuid) {
    return <Navigate to={PATH.HOME} />;
  }

  const {
    data,
    isLoading,
    isError,
    refetch: refetchRoom,
  } = useGetUuidRoom(roomShortUuid);

  useEffect(() => {
    connect(roomShortUuid);
    refetchMyInfo();

    return () => {
      if (!client || !subscription) return;

      subscription.unsubscribe();
      client.deactivate();

      resetMessage();
      resetRoom();
    };
  }, []);

  useEffect(() => {
    refetchRoom();
    if (receiveLogs.at(-1) === SOCKET_TYPE.ROOM.START_CODING) {
      console.log(receiveLogs);
      navigate(`${PATH.PROBLEMSOLVE}/${roomShortUuid}`, { replace: true });
    }

    if (myInfo && data?.response) {
      setRoomData(data.response);
    }
  }, [myInfo, data, listeners, receiveLogs]);

  useEffect(() => {
    if (!myInfo) return;

    const myData = findMyRoomData(roomData.roomMembers, myInfo.response.email);

    if (myData) {
      setMyRoomData(myData);
    }
  }, [roomData]);

  if (isError) {
    alert('방 정보를 불러오지 못했습니다. 잠시 후 다시 입장해주세요.');
    return <Navigate to={PATH.HOME} />;
  }

  const beforeUnloadListener = (e: BeforeUnloadEvent) => {
    e.preventDefault();

    disconnect();
    resetRoom();
  };

  useEffect(() => {
    window.addEventListener('beforeunload', beforeUnloadListener);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadListener);
    };
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <S.RoomContainer className="roompage">
      <S.WaitingRoomContainer className="waitingroom-container">
        <RoomHeader className="roomheader-container" />
        <MemberList className="memberlist-container" />
        <TestInfo className="testinfo-container" />
      </S.WaitingRoomContainer>
      <S.ChatContainer className="chat-container">
        <Chat />
      </S.ChatContainer>
    </S.RoomContainer>
  );
}
