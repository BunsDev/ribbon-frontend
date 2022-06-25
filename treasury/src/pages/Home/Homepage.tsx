import styled, { css, keyframes } from "styled-components";
import sizes from "shared/lib/designSystem/sizes";
import theme from "shared/lib/designSystem/theme";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import usePullUp from "webapp/lib/hooks/usePullUp";
import { useHistory } from "react-router-dom";
import { VaultName, VaultNameOptionMap } from "shared/lib/constants/constants";
import ReactPlayer from "react-player";
import colors from "shared/lib/designSystem/colors";
import { ExternalIcon } from "shared/lib/assets/icons/icons";
import { useCallback, useEffect, useState } from "react";

const HomepageContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const FloatingContainer = styled.div<{ footerHeight?: number }>`
  width: 100%;
  height: calc(
    100vh - ${theme.header.height}px -
      ${(props) => (props.footerHeight ? props.footerHeight + 48 : 48)}px
  );
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 600px;
  position: relative;

  @media (max-width: ${sizes.md}px) {
    flex-direction: column;
  }
`;

const PlayerContainer = styled(ReactPlayer)`
  height: 400px;
  width: 100%;
  position: absolute;
  pointer-events: none !important;
  z-index: -1;
`;

const LandingContent = styled.div`
  text-align: center;

  > *:not(:last-child) {
    margin-bottom: 16px !important;
  }

  h1 {
    color: white;
    font-size: 56px;
    font-family: VCR;
    text-transform: uppercase;
  }

  p {
    font-size: 16px;
    color: ${colors.text};
  }
`;

const ProductText = styled.p`
  font-size: 10px !important;

  > * {
    display: inline-flex;
  }

  a {
    color: ${colors.text};
    text-decoration: underline;

    span {
      display: block;
      margin-left: 4px;
    }
  }
`;

const AccessLink = styled.a`
  font-size: 14px;
  color: ${colors.primaryText};
  padding: 8px 16px;
  background: none;
  border: 1px solid white;
  border-radius: 6px;
  display: block;
  margin: auto;
  font-family: VCR;
  text-transform: uppercase;
  width: fit-content;

  &:hover {
    background-color: ${colors.primaryText};
    color: black;
    text-decoration: none;
  }
`;

const LandingSteps = styled.div<{ totalSteps: number }>`
  position: absolute;
  bottom: 48px;
  display: flex;
  transition: 0.2s;

  @media (max-width: calc(1000px + 160px)) {
    display: none;
  }
`;

const StepContainer = styled.div`
  width: 300px;
  position: relative;

  &:not(:last-of-type) {
    margin-right: 50px;
  }
`;

const StepTitle = styled.h6<{ active: boolean }>`
  transition: 0.2s;
  color: ${(props) =>
    props.active ? colors.primaryText : colors.quaternaryText};
  font-family: VCR;
  text-align: center;
`;

const StepContent = styled.p<{ active: boolean }>`
  transition: 0.2s;
  color: ${(props) => (props.active ? colors.text : colors.quaternaryText)};
  text-align: center;
  font-size: 14px;
`;

const StepProgressContainer = styled.div`
  position: absolute;
  bottom: 0px;
  height: 4px;
  background: ${colors.background.four};
  width: 100%;
`;

const progress = keyframes`
  from {
    width: 0%;
  }

  to {
    width: 100%;
  }
`;

const animation = css<{ interval: number }>`
  animation: ${(props) => props.interval}s ${progress} infinite;
  background: white;
`;

const StepProgress = styled.div<{ active: boolean; interval: number }>`
  height: 4px;
  transition: 0.2s;

  ${(props) => (props.active ? animation : "width: 0%")};
`;

const livelyAnimation = (position: "top" | "bottom") => keyframes`
  0% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }

  50% {
    background-position-x: ${position === "top" ? 100 : 0}%; 
  }

  100% {
    background-position-x: ${position === "top" ? 0 : 100}%;
  }
`;

const FrameBar = styled.div<{
  position: "top" | "bottom";
  height: number;
}>`
  position: absolute;
  width: 100%;
  height: ${(props) => props.height}px;
  background: ${(props) => `linear-gradient(
    270deg,
    ${colors.asset.veRBN}00 5%,
    ${colors.asset.veRBN} 50%,
    ${colors.asset.veRBN}00 95%
  )`};
  background-size: 200%;
  animation: 10s ${(props) => livelyAnimation(props.position)} linear infinite;
  ${(props) => {
    if (props.position === "top") {
      return `top: ${theme.header.height}px;`;
    } else {
      return `bottom: 0px`;
    }
  }};
`;

interface Step {
  title: string;
  content: string;
  interval?: number;
}

const Homepage = () => {
  usePullUp();
  const history = useHistory();
  const { video } = useScreenSize();
  const auth = localStorage.getItem("auth");
  const [footerRef, setFooterRef] = useState<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const interval = 5;

  useEffect(() => {
    const stepTimer = setTimeout(() => {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
      } else {
        setActiveStep(0);
      }
    }, interval * 1000);

    return () => clearTimeout(stepTimer);
  });

  const steps: Step[] = [
    {
      title: "01",
      content:
        "Diversify your DAO's treasury holdings by earning premiums in stables",
    },
    {
      title: "02",
      content:
        "Customise your covered call strike selection methodology, tenor and premium currency",
    },
    {
      title: "03",
      content:
        "Leverage Ribbon's network of market makers to boostrap a market",
    },
  ];

  if (auth) {
    const vault = JSON.parse(auth).pop();
    if (vault) {
      let vaultName;
      Object.keys(VaultNameOptionMap).filter((name) => {
        if (VaultNameOptionMap[name as VaultName] === vault) {
          vaultName = name;
        }
        return null;
      });
      history.push("/treasury/" + vaultName);
    }
  }

  const onSetFooterRef = useCallback((ref) => {
    setFooterRef(ref);
  }, []);

  return (
    <HomepageContainer>
      <FrameBar position="top" height={4} />
      <FloatingContainer footerHeight={footerRef?.offsetHeight}>
        <PlayerContainer
          key="video-player"
          url="https://player.vimeo.com/video/722230744"
          playing={true}
          width={"100vw"}
          height={video.height}
          style={{
            maxWidth: "100vw",
            maxHeight: "100vh",
          }}
          config={{ vimeo: { playerOptions: { background: true } } }}
          muted
          loop
        />
        <LandingContent>
          <h1>Treasury</h1>
          <p>Earn yield on your protocol's native token</p>
          <AccessLink
            href="https://d9gte6lu2ax.typeform.com/to/ZaNFY9zP"
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply for access
          </AccessLink>
          <ProductText>
            A product by{" "}
            <a
              href="https://ribbon.finance"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ribbon Finance <ExternalIcon height={12} width={12} />
            </a>
          </ProductText>
        </LandingContent>
      </FloatingContainer>
      <LandingSteps ref={onSetFooterRef} totalSteps={steps.length}>
        {steps.map((step, i) => (
          <StepContainer>
            <StepTitle active={activeStep === i}>{step.title}</StepTitle>
            <StepContent active={activeStep === i}>{step.content}</StepContent>
            <StepProgressContainer>
              <StepProgress interval={interval} active={activeStep === i} />
            </StepProgressContainer>
          </StepContainer>
        ))}
      </LandingSteps>
      <FrameBar position="bottom" height={4} />
    </HomepageContainer>
  );
};

export default Homepage;
