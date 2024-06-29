import { useAppConfigStore } from "@/store/app";
import { useShallow } from "zustand/react/shallow";

export default function useMultipleTabSetting() { 
  const { getShowMultipleTab } = useAppConfigStore(
    useShallow((state) => ({
      getShowMultipleTab: state.multiTabsSetting.show,
    })),
  )

  return {
    getShowMultipleTab,
  }
}