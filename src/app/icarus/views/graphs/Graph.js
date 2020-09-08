import React from 'react'
import utils from '@/utils'

export class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.displayName = 'Graph'
    this.state = {
      margin: {
        top: 0,
        right: 64,
        bottom: 36,
        left: 64,
      },
      resize: 0,
    }
  }

  get mWidth() {
    return this.props.width - (this.state.margin.left + this.state.margin.right)
  }

  get mHeight() {
    return (
      this.props.height - (this.state.margin.top + this.state.margin.bottom)
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.data !== this.props.data ||
      nextProps.isLoading !== this.props.isLoading ||
      nextProps.value !== this.props.value
    )
  }

  render() {
    console.warn('You should implement this')
    return null
  }
}

export default Graph
