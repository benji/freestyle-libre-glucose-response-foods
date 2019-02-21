const verticalLinePlugin = {
    getLinePositionFromTime: function (chart, time) {
        var xscale = chart.scales['x-axis-0']
        var xratio = (time - xscale.min) / (xscale.max - xscale.min)
        var xpos = xscale.left + (xscale.right - xscale.left) * xratio
        return xpos
    },
    renderVerticalLineAtTime: function (chartInstance, time, label) {
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
        context.fillText(label, lineLeftOffset, (scale.bottom - scale.top) / 2 + scale.top);
    },

    afterDatasetsDraw: function (chart, easing) {
        if (chart.config.marks) {
            chart.config.marks.forEach(mark => {
                this.renderVerticalLineAtTime(chart, mark.time, mark.label)
            });
        }
    }
};

Chart.plugins.register(verticalLinePlugin);