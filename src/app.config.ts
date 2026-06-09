export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/jobs/index',
    'pages/schedule/index',
    'pages/resume/index',
    'pages/stats/index',
    'pages/job-detail/index',
    'pages/job-edit/index',
    'pages/resume-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#5B6FFF',
    navigationBarTitleText: '求职助手',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F5F7FF'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#5B6FFF',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/jobs/index',
        text: '岗位'
      },
      {
        pagePath: 'pages/schedule/index',
        text: '日程'
      },
      {
        pagePath: 'pages/resume/index',
        text: '简历'
      },
      {
        pagePath: 'pages/stats/index',
        text: '统计'
      }
    ]
  }
})
