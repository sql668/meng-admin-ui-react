import Loading from "@/components/loading";
import useSearchParam  from "@/hooks/useSearchParam";
import { useTagsTabStore } from "@/store/tagsView";
import { useEffect } from "react";
import {  useNavigate, useParams} from "react-router-dom";

export function RedirectView() {

  const sm = useSearchParam()
  const homePath = useTagsTabStore.use.defaultTag()
  const nav = useNavigate()
  const params = useParams()


  useEffect(() => {
    let redirect = homePath
    if (params['*']) {
      redirect = '/' + params['*']
    }
    nav(`${redirect}${location.search}`, { replace: true })
  }, [sm, homePath, params])
  return <Loading></Loading>
}
