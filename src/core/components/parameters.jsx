import React, { Component } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import Im from "immutable"

// More readable, just iterate over maps, only
const eachMap = (iterable, fn) => iterable.valueSeq().filter(Im.Map.isMap).map(fn)

export default class Parameters extends Component {

  static propTypes = {
    parameters: ImPropTypes.list.isRequired,
    specActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired,
    tryItOutEnabled: PropTypes.bool,
    allowTryItOut: PropTypes.bool,
    onTryoutClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    onChangeKey: PropTypes.array,
    pathMethod: PropTypes.array.isRequired,
    getConfigs: PropTypes.func.isRequired
  }


  static defaultProps = {
    onTryoutClick: Function.prototype,
    onCancelClick: Function.prototype,
    tryItOutEnabled: false,
    allowTryItOut: true,
    onChangeKey: [],
  }

  onChange = (param, value, isXml) => {
    let {
      specActions: { changeParam },
      onChangeKey,
    } = this.props

    changeParam(onChangeKey, param.get("name"), param.get("in"), value, isXml)
  }

  onChangeConsumesWrapper = (val) => {
    let {
      specActions: { changeConsumesValue },
      onChangeKey
    } = this.props

    changeConsumesValue(onChangeKey, val)
  }

  render() {

    let {
      onTryoutClick,
      onCancelClick,
      parameters,
      allowTryItOut,
      tryItOutEnabled,

      fn,
      getComponent,
      getConfigs,
      specSelectors,
      pathMethod
    } = this.props

    const ParameterRow = getComponent("parameterRow")
    const TryItOutButton = getComponent("TryItOutButton")

    const isExecute = tryItOutEnabled && allowTryItOut

    return (
      <div className="opblock-section">
        <div className="opblock-section-header">
          <div className="tab-header">
            <h4 className="opblock-title">Parameters</h4>
          </div>
          {/* {allowTryItOut ? (
            <TryItOutButton enabled={tryItOutEnabled} onCancelClick={onCancelClick} onTryoutClick={onTryoutClick} />
          ) : null} */}
        </div>
        {!parameters.count() ? <div className="opblock-description-wrapper"><p>No parameters</p></div> :
          <div className="parameters">
            {
              eachMap(parameters, (parameter) => (
                <ParameterRow fn={fn}
                  getComponent={getComponent}
                  getConfigs={getConfigs}
                  param={parameter}
                  key={`${parameter.get("in")}.${parameter.get("name")}`}
                  onChange={this.onChange}
                  onChangeConsumes={this.onChangeConsumesWrapper}
                  specSelectors={specSelectors}
                  pathMethod={pathMethod}
                  isExecute={isExecute} />
              )).toArray()
            }
          </div>
        }
      </div>
    )
  }
}
