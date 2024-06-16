export default function Home() {
  return (
    <div className='meng-admin-pagecontainer'>
      <h1>Meng React Admin</h1>
      <p style={{ padding: '8px' }}>
        从2023年开始自己利用休息时间自学了React,但是不知道自己到底有没有学会,所以就想着用React写一个后台管理系统,一方面可以巩固自己的知识,
        另一方面也可以作为自己的一个开源项目,让更多的人看到,一起学习,一起进步.
      </p>

      <h3>前端技术栈</h3>
      <ul>
        <li>React ^18.2.0</li>
        <li>antd ^5.14.2</li>
        <li>zustand ^4.5.0</li>
        <li>unocss ^0.58.5</li>
      </ul>
    </div>
  )
}
