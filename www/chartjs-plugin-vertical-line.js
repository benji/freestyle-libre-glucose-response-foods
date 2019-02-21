const verticalLinePlugin = {
    getLinePositionFromTime: function (chart, time) {
        var xscale = chart.scales['x-axis-0']
        console.log(123)
        console.log(xscale)
        console.log(time)
        console.log(321)
        console.log(xscale.min)
        console.log(xscale.max)
        var xratio = (time - xscale.min) / (xscale.max - xscale.min)
        console.log(xratio)

        return xscale.left + (xscale.right - xscale.left) * xratio
    },
    renderVerticalLineAtTime: function (chartInstance, time) {
        const lineLeftOffset = this.getLinePositionFromTime(chartInstance, time);
        const scale = chartInstance.scales['y-axis-0'];
        const context = chartInstance.chart.ctx;

        // render vertical line
        context.beginPath();
        context.strokeStyle = '#ff0000';
        context.moveTo(lineLeftOffset, scale.top);
        context.lineTo(lineLeftOffset, scale.bottom);
        context.stroke();

        // write label
        context.fillStyle = "#ff0000";
        context.textAlign = 'center';
        context.fillText('intake', lineLeftOffset, (scale.bottom - scale.top) / 2 + scale.top);
    },

    afterDatasetsDraw: function (chart, easing) {
        if (chart.config.lineAt) {
            chart.config.lineAt.forEach(time => this.renderVerticalLineAtTime(chart, time));
        }
    }
};

Chart.plugins.register(verticalLinePlugin);