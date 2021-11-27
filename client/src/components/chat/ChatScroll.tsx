import { Component } from "react";
import styled from "styled-components";
import { throttle } from "../../helpers/util";
import { Spinner } from "../spinner";

type Props = {
  page: number | null;
  onScrollTop: (messageBoxHeight: number) => void;
  onMount: (ref: HTMLDivElement | null) => void;
  style: React.CSSProperties | undefined
}

type State = {
  loading: boolean;
}
export default class ChatScroll extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  scrollContainer: HTMLDivElement | null = null

  componentDidMount() {
    this.addScrollEvent()
    this.props.onMount(this.scrollContainer)
  }

  addScrollEvent = () => {
    this.scrollContainer?.addEventListener("scroll", throttle(this.handleScrolling), false);
    document.addEventListener("DOMContentLoaded", this.handleScrolling, false);
  }

  handleScrolling = async () => {
    if (!this.scrollContainer) return;
    
    if (!this.state.loading || this.props.page === 1) {
      if (this.scrollContainer.scrollTop <= 0) {
        try {
          this.setState({ loading: true })
          await this.props.onScrollTop(this.scrollContainer.scrollHeight);
        } catch (error) {
          console.warn(error);
        } finally {
          this.setState({ loading: false })
          // setTimeout(() => {this.setState({ loading: false })}, 3000)
        }
      }
    }
}

  render() {
    return (
      <ScrollContainer ref={(el) => this.scrollContainer = el} style={this.props.style}>
        <ShowLoading show={this.state.loading}>
          <Spinner />
        </ShowLoading>
        <Content>{this.props.children}</Content>
      </ScrollContainer>
    )
  }
}

const ScrollContainer = styled.div`
  padding-block: 1rem;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  position: relative;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    width: 5px;
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.icon};
    border-radius: 50px;
  }
`

const Content = styled.div`
  min-height: calc(100% + 10px);
  padding-bottom: calc(100vh / 3);
`

const ShowLoading = styled.div<{ show: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  position: absolute;
  width: 100%;
  transition: all ease-in-out .3s;
  top: ${props => !props.show ? -100 : 0}px;
`