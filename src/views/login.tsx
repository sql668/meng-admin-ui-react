import { CaptchaApi, LoginApi } from '@/api/login'
import { TOKEN, TOKEN_EXPIRES_TIME } from '@/config/config'
import useRootSetting from '@/hooks/setting/useRootSetting'
import { restRoutes, router } from '@/router/baseRouter'
import { setPermissionRouters } from '@/store/permission'
import { resetTagsTab } from '@/store/tagsView'
import { setPermissions } from '@/store/user'
//import { addRoutes, asyncRouter } from '@/router'
import { CaptchaResp } from '@/types/model/base'
import { Session } from '@/utils/storage'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, Row, message } from 'antd'
import { createStyles } from 'antd-style'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
//import loginBG from '@/assets/img/bg.svg'
const useStyles = createStyles(({ token }) => ({
  container: {
    //backgroundImage: `url(${loginBG})`,
    backgroundColor: token.colorBgContainer,
  },
}))

type FieldType = {
  userName: string
  password: string
  captcha: string
  captchaId: string
  remember: string
}

export default function Login() {
  const { styles, cx } = useStyles()
  const [btnLoad, setBtnLoad] = useState(false)
  const [captch, setCaptcha] = useState<CaptchaResp>()
  const nav = useNavigate()
  const [form] = Form.useForm()
  const { getAppName } = useRootSetting()
  const onFinsh = useCallback(async (values: any) => {
    setBtnLoad(true)
    try {
      const res = await LoginApi({
        userName: values.userName,
        password: values.password,
        captcha: values.captcha,
        captchaId: values.captchaId,
      })
      if (res.code === 0) {
        // 后端会直接把token存到cookie
        if (process.env.NODE_ENV === 'development') {
          Session.set(TOKEN, res.data?.token || '')
          Session.set(TOKEN_EXPIRES_TIME, res.data?.expiresAt + '')
        }
        //setUser(res.data?.userInfo)
        // nav(HOME_PATHNAME, {
        //   replace: true,
        // })
        nav('/redirect')
      } else {
        getCaptcha()
        setBtnLoad(false)
        message.error(res.msg)
      }
    } catch (error: any) {
      getCaptcha()
      setBtnLoad(false)
      message.error(error)
    }
  }, [])
  const getCaptcha = useCallback(() => {
    CaptchaApi().then((res) => {
      setCaptcha(res.data)
      form.setFieldsValue({
        captchaId: res.data?.captchaId,
      })
    })
  }, [])

  useEffect(() => {
    resetTagsTab()
    setPermissions([])
    setPermissionRouters([])
    restRoutes(router.routes)
    getCaptcha()
  }, [])
  return (
    <div className={cx('bg-white wh-full', 'login-container', styles.container)}>
      <div className=''>
        <div className='font-size-28 font-800 text-center'>{getAppName}</div>
        <div className='mt-20 text-center'>欢迎使用，请先登录</div>
        <Form className='w-300 my-50' onFinish={onFinsh} form={form}>
          <Form.Item<FieldType>
            name='userName'
            rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder='账号:admin/user' autoComplete='off' />
          </Form.Item>
          <Form.Item<FieldType> name='password' rules={[{ required: true, message: '请输入密码' }]}>
            <Input
              prefix={<LockOutlined />}
              type='password'
              autoComplete='off'
              placeholder='密码:123456'
            />
          </Form.Item>
          <Form.Item<FieldType>
            name='captcha'
            rules={[{ required: true, message: '请输入验证码' }]}>
            <div className='flex'>
              <Input type='input' className='flex-grow-2' autoComplete='off' placeholder='验证码' />
              {captch?.captchaBase64 && (
                <img
                  alt='请输入验证码'
                  onClick={getCaptcha}
                  src={captch?.captchaBase64}
                  className='flex-grow-1 ml-10 h-32 bg-[#c3d4f2] cursor-pointer'
                />
              )}
            </div>
          </Form.Item>
          <Form.Item name='captchaId' hidden>
            <Input />
          </Form.Item>
          {/* <Form.Item>
            <Form.Item<FieldType> name='remember' valuePropName='checked' noStyle>
              <Checkbox className='float-left'>记住我</Checkbox>
            </Form.Item>
          </Form.Item> */}
          <Row justify='space-around'>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
              loading={btnLoad}>
              登录
            </Button>
            <Button htmlType='reset'>重置</Button>
          </Row>
        </Form>
      </div>
    </div>
  )
}
