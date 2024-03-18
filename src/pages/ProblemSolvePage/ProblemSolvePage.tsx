import { Panel, PanelGroup } from 'react-resizable-panels';
import { useNavigate } from 'react-router-dom';

import { Button, CodeEditor, ResizeHandle } from '@/components';
import { useCustomTheme } from '@/hooks/useCustomTheme';
import useModal from '@/hooks/useModal';
import useCodeEditorStore from '@/store/CodeEditorStore';
import useRoomStore from '@/store/RoomStore';

import { DIRECTION, SIZE_PERCENTAGE } from './constants';
import ProblemExecution from './ProblemExecution/ProblemExecution';
import ProblemSection from './ProblemSection/ProblemSection';
import * as S from './ProblemSolvePage.style';
import ProblemSubmitModal from './ProblemSubmitModal/ProblemSubmitModal';

export default function ProblemSolvePage() {
  const { theme } = useCustomTheme();
  const { modalRef, isOpen, openModal, closeModal } = useModal();

  const navigate = useNavigate();

  const { roomData } = useRoomStore();
  const roomShortUuid = roomData.roomShortUuid;
  const problemLink = roomData.problemLink;

  const { mutate: compileMutate, isLoading: isCompileLoading } = useCompile();
  const { mutate: submitMutate } = useSubmission();

  const { input, code, language } = useCodeEditorStore(state => state);

  const handleCompileExecution = async () => {
    compileMutate({ code, input, language });
  };

  const handleSubmit = async () => {
    openModal();
  };

  const handleClickProblemLink = () => {
    if (!problemLink) return;

    window.open(problemLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <S.Wrapper>
      <S.ContentsWrapper>
        <PanelGroup direction={DIRECTION.HORIZONTAL}>
          <Panel defaultSize={SIZE_PERCENTAGE.PROBLEM}>
            {/* 문제 영역 */}
            <S.ProblemLinkContainer>
              <S.ProblemLinkText>
                문제 출처 :{' '}
                <S.ProblemLink onClick={handleClickProblemLink}>
                  {problemLink}
                </S.ProblemLink>
              </S.ProblemLinkText>
            </S.ProblemLinkContainer>
            <ProblemSection />
          </Panel>
          <ResizeHandle direction={DIRECTION.HORIZONTAL} />
          <Panel defaultSize={SIZE_PERCENTAGE.SOLVE}>
            <PanelGroup direction={DIRECTION.VERTICAL}>
              <Panel defaultSize={SIZE_PERCENTAGE.EDITOR}>
                {/* 에디터 영역 */}
                <S.EditorWrapper>
                  <CodeEditor />
                </S.EditorWrapper>
              </Panel>
              <ResizeHandle direction={DIRECTION.VERTICAL} />
              <Panel defaultSize={SIZE_PERCENTAGE.EXECUTION}>
                {/* 실행 영역 */}
                <ProblemExecution isLoading={isCompileLoading} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </S.ContentsWrapper>
      {/* 실행 및 제출 버튼 영역 */}
      <S.ButtonWrapper>
        <Button
          width="12rem"
          height="4rem"
          fontSize="1.6rem"
          backgroundColor={theme.color.gray_20}
          onClick={handleCompileExecution}
        >
          실행
        </Button>
        <Button
          width="12rem"
          height="4rem"
          fontSize="1.6rem"
          onClick={handleSubmit}
        >
          제출
        </Button>
      </S.ButtonWrapper>
      <ProblemSubmitModal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </S.Wrapper>
  );
}
