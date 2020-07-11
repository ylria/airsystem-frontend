import React from 'react';
import GaugeCanvas from './GaugeCanvas';

class Gauge extends React.Component {
	componentDidMount() {

	}
	render() {
		let percent = this.props.value / (this.props.norm * 2);
		percent = Math.max(0, percent);
		percent = Math.min(1, percent);

		let red = 220 * percent;
		let green = 220 * (1-percent);
		let color = `rgb(${red}, ${green}, 80)`;
		return (
			<div style={{ position: "relative", width: this.props.width, height: this.props.height }}>
				<div style={{ position: "absolute", left: "0px", top: "0px" }}>
					<GaugeCanvas percent={percent} color={color}>
					</GaugeCanvas>
				</div>

				<div style={{ position: "absolute", top: "35%", left: "25%", width: "50%", height: "35%", display: "flex", alignItems: "center", justifyContent: "center" }}>
					<div style={{ width: "45%", float: "left", textAlign: "center" }}>
						<div style={{ color: "#000", fontSize: "19px", fontWeight: "400" }}>
							{Math.round(this.props.value * 10) / 10}
						</div>
						<div style={{ color: "#888", fontSize: "10px", fontWeight: "300"  }}>
							{this.props.unit}
						</div>
					</div>
					<div style={{ width: "10%", height: "100%", float: "left", background: "linear-gradient(#AAA, #AAA) no-repeat center/1px 50%" }}>
					</div>
					<div style={{ width: "45%", float: "right", textAlign: "center" }}>
						<span style={{ color: "#000", fontSize: "19px", fontWeight: "400" }}>
							{Math.round(this.props.value / this.props.norm * 100)}
						</span>
						<span style={{ color: "#000", fontSize: "10px", fontWeight: "300" }}>
							%
						</span>
					</div>
				</div>
				<div style={{ position: "absolute", width: this.props.width, left: "0px", top: "70%", textAlign: "center", color: "#000", fontSize: "20px", fontWeight: "500" }}>
					{this.props.name}
				</div>
			</div>
		)
	}
}

Gauge.defaultProps = {
	name: "PM10",
	width: 200,
	height: 140,
	percent: 0.5,
	color: 'rgb(253, 150, 100)',
}

export default Gauge;