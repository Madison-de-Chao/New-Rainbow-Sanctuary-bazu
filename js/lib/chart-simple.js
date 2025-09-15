// Simple Chart.js replacement for local use
class Chart {
  constructor(ctx, config) {
    // Handle string selectors or direct elements
    if (typeof ctx === 'string') {
      this.ctx = document.getElementById(ctx.replace('#', ''));
    } else if (ctx && ctx.getContext) {
      // It's already a canvas element
      this.ctx = ctx;
      this.canvas = ctx;
    } else if (ctx && ctx.querySelector) {
      // It's a container element
      this.ctx = ctx;
      this.canvas = ctx.querySelector('canvas');
    } else {
      this.ctx = ctx;
      this.canvas = null;
    }
    
    this.config = config;
    
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 300;
      this.canvas.height = 300;
      if (this.ctx && this.ctx.appendChild) {
        this.ctx.appendChild(this.canvas);
      }
    }
    
    if (this.canvas) {
      this.render();
    }
  }
  
  render() {
    const context = this.canvas.getContext('2d');
    const { type, data } = this.config;
    
    if (type === 'pie' || type === 'doughnut') {
      this.renderPieChart(context, data);
    } else if (type === 'bar') {
      this.renderBarChart(context, data);
    } else {
      this.renderFallback(context);
    }
  }
  
  renderPieChart(context, data) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    
    if (!data.datasets || !data.datasets[0] || !data.datasets[0].data) {
      this.renderFallback(context);
      return;
    }
    
    const values = data.datasets[0].data;
    const labels = data.labels || [];
    const colors = data.datasets[0].backgroundColor || this.generateColors(values.length);
    
    const total = values.reduce((sum, value) => sum + value, 0);
    let currentAngle = -Math.PI / 2;
    
    // Clear canvas
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw pie slices
    values.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      context.beginPath();
      context.moveTo(centerX, centerY);
      context.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      context.closePath();
      
      context.fillStyle = colors[index] || this.generateColors(1)[0];
      context.fill();
      
      context.strokeStyle = '#fff';
      context.lineWidth = 2;
      context.stroke();
      
      // Draw label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + (radius * 0.7) * Math.cos(labelAngle);
      const labelY = centerY + (radius * 0.7) * Math.sin(labelAngle);
      
      context.fillStyle = '#fff';
      context.font = '12px sans-serif';
      context.textAlign = 'center';
      if (labels[index]) {
        context.fillText(labels[index], labelX, labelY);
      }
      
      currentAngle += sliceAngle;
    });
  }
  
  renderBarChart(context, data) {
    if (!data.datasets || !data.datasets[0] || !data.datasets[0].data) {
      this.renderFallback(context);
      return;
    }
    
    const values = data.datasets[0].data;
    const labels = data.labels || [];
    const colors = data.datasets[0].backgroundColor || this.generateColors(values.length);
    
    const margin = 40;
    const chartWidth = this.canvas.width - 2 * margin;
    const chartHeight = this.canvas.height - 2 * margin;
    const barWidth = chartWidth / values.length - 10;
    const maxValue = Math.max(...values);
    
    // Clear canvas
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw bars
    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = margin + index * (barWidth + 10);
      const y = this.canvas.height - margin - barHeight;
      
      context.fillStyle = colors[index] || this.generateColors(1)[0];
      context.fillRect(x, y, barWidth, barHeight);
      
      // Draw label
      context.fillStyle = '#333';
      context.font = '12px sans-serif';
      context.textAlign = 'center';
      if (labels[index]) {
        context.fillText(labels[index], x + barWidth / 2, this.canvas.height - margin + 15);
      }
      
      // Draw value
      context.fillText(value.toString(), x + barWidth / 2, y - 5);
    });
  }
  
  renderFallback(context) {
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.fillStyle = '#f0f0f0';
    context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    context.fillStyle = '#666';
    context.font = '16px sans-serif';
    context.textAlign = 'center';
    context.fillText('圖表載入中...', this.canvas.width / 2, this.canvas.height / 2);
  }
  
  generateColors(count) {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
      '#4BC0C0', '#FF6384'
    ];
    return colors.slice(0, count);
  }
  
  destroy() {
    // Cleanup method for compatibility
  }
  
  update() {
    this.render();
  }
}

// Make it available globally for compatibility
window.Chart = Chart;