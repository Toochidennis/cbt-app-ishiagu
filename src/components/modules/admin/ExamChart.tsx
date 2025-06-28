import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const ExamChart: React.FC = () => {
    useEffect(() => {
        const chartDom = document.getElementById('exam-stats-chart');
        if (chartDom) {
            const myChart = echarts.init(chartDom);
            myChart.setOption({
                animation: false,
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                legend: { data: ['Scheduled', 'Completed', 'Pending'] },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: { type: 'category', data: ['Math', 'Physics', 'Chem', 'Bio', 'Eng'] },
                yAxis: { type: 'value' },
                series: [
                    { name: 'Scheduled', type: 'bar', stack: 'total', data: [5, 4, 6, 3, 7] },
                    { name: 'Completed', type: 'bar', stack: 'total', data: [3, 2, 5, 2, 4] },
                    { name: 'Pending', type: 'bar', stack: 'total', data: [2, 2, 1, 1, 3] },
                ],
            });
            window.addEventListener('resize', myChart.resize);
            return () => {
                window.removeEventListener('resize', myChart.resize);
                myChart.dispose();
            };
        }
    }, []);

    return <div id="exam-stats-chart" className="w-full h-80"></div>;
};

export default ExamChart;
