import Not1Png from '@/assets/img/404_cloud.png'
import Not2Png from '@/assets/img/404.png'
import { Link } from 'react-router-dom'
export default function NotFound() {
  // return <div className="wscn-http404-container">
  //   <div className="wscn-http404">
  //     <div className="pic-404">
  //       <img className="pic-404__parent" src="@/assets/404_images/404.png" alt="404">
  //       <img className="pic-404__child left" src="@/assets/404_images/404_cloud.png" alt="404">
  //       <img className="pic-404__child mid" src="@/assets/404_images/404_cloud.png" alt="404">
  //       <img className="pic-404__child right" src="@/assets/404_images/404_cloud.png" alt="404">
  //     </div>
  //     <div className="bullshit">
  //       <div className="bullshit__oops">
  //         404错误!
  //       </div>
  //       <div class="bullshit__headline">
  //         {{ message }}
  //       </div>
  //       <div className="bullshit__info">
  //         对不起，您正在寻找的页面不存在。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。
  //       </div>
  //     </div>
  //   </div>
  // </div>

  return (
    <div className='meng-layout-global-404-box'>
      <div className='wscn-http404-container'>
        <div className='wscn-http404'>
          <div className='pic-404'>
            <img src={Not2Png} alt='404' className='pic-404__parent' />
            <img className='pic-404__child left' src={Not1Png} alt='404'></img>
            <img className='pic-404__child mid' src={Not1Png} alt='404'></img>
            <img className='pic-404__child mid' src={Not1Png} alt='404'></img>
          </div>
          <div className='bullshit'>
            <div className='bullshit__oops'>404错误!</div>
            <div className='bullshit__headline'>找不到网页</div>
            <div className='bullshit__info'>
              对不起，您正在寻找的页面不存在。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。
            </div>
            <Link to='/home' className='bullshit__return-home router-link-active'>
              返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
