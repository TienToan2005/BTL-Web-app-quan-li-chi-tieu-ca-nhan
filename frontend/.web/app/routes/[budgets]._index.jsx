import {Fragment,useCallback,useContext,useEffect} from "react"
import {ReflexEvent,isNotNullOrUndefined,refs} from "$/utils/state"
import {Toaster,toast} from "sonner"
import {ColorModeContext,EventLoopContext,StateContexts} from "$/utils/context"
import {Box as RadixThemesBox,Button as RadixThemesButton,Card as RadixThemesCard,Flex as RadixThemesFlex,Heading as RadixThemesHeading,Link as RadixThemesLink,Select as RadixThemesSelect,Table as RadixThemesTable,Text as RadixThemesText,TextField as RadixThemesTextField} from "@radix-ui/themes"
import {Link as ReactRouterLink} from "react-router"
import DebounceInput from "react-debounce-input"
import {jsx} from "@emotion/react"




function Toaster_11b04b7ca7e917be1c8df8032e226c05 () {
  const { resolvedColorMode } = useContext(ColorModeContext)
refs['__toast'] = toast


  return (
    jsx(Toaster,{closeButton:false,expand:true,position:"bottom-right",richColors:true,theme:resolvedColorMode},)
  )
}


function Link_015ce0ab41dba4ebe292742f7c0f121d () {
  const reflex___state____state = useContext(StateContexts.reflex___state____state)



  return (
    jsx(RadixThemesLink,{asChild:true,css:({ ["width"] : "100%", ["&:hover"] : ({ ["color"] : "var(--accent-8)" }) }),underline:"none"},jsx(ReactRouterLink,{to:"/"},jsx(RadixThemesBox,{css:({ ["display"] : "flex", ["alignItems"] : "center", ["padding"] : "14px 16px", ["marginBottom"] : "12px", ["borderRadius"] : "12px", ["color"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/"?.valueOf?.()) ? "#fff" : "rgba(255, 255, 255, 0.7)"), ["transition"] : "all 0.3s", ["fontWeight"] : "500", ["width"] : "100%", ["textDecoration"] : "none", ["&:hover"] : ({ ["background"] : "rgba(255, 255, 255, 0.15)", ["color"] : "#fff" }), ["background"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/"?.valueOf?.()) ? "rgba(255, 255, 255, 0.15)" : "transparent"), ["borderLeft"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/"?.valueOf?.()) ? "4px solid #00c6ff" : "4px solid transparent") })},"T\u1ed5ng quan")))
  )
}


function Link_3e96be4e17ea2bbdc4d7bf09c8e79232 () {
  const reflex___state____state = useContext(StateContexts.reflex___state____state)



  return (
    jsx(RadixThemesLink,{asChild:true,css:({ ["width"] : "100%", ["&:hover"] : ({ ["color"] : "var(--accent-8)" }) }),underline:"none"},jsx(ReactRouterLink,{to:"/wallets"},jsx(RadixThemesBox,{css:({ ["display"] : "flex", ["alignItems"] : "center", ["padding"] : "14px 16px", ["marginBottom"] : "12px", ["borderRadius"] : "12px", ["color"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/wallets"?.valueOf?.()) ? "#fff" : "rgba(255, 255, 255, 0.7)"), ["transition"] : "all 0.3s", ["fontWeight"] : "500", ["width"] : "100%", ["textDecoration"] : "none", ["&:hover"] : ({ ["background"] : "rgba(255, 255, 255, 0.15)", ["color"] : "#fff" }), ["background"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/wallets"?.valueOf?.()) ? "rgba(255, 255, 255, 0.15)" : "transparent"), ["borderLeft"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/wallets"?.valueOf?.()) ? "4px solid #00c6ff" : "4px solid transparent") })},"V\u00ed")))
  )
}


function Link_627970f042d85967af8da2972035db6c () {
  const reflex___state____state = useContext(StateContexts.reflex___state____state)



  return (
    jsx(RadixThemesLink,{asChild:true,css:({ ["width"] : "100%", ["&:hover"] : ({ ["color"] : "var(--accent-8)" }) }),underline:"none"},jsx(ReactRouterLink,{to:"/categories"},jsx(RadixThemesBox,{css:({ ["display"] : "flex", ["alignItems"] : "center", ["padding"] : "14px 16px", ["marginBottom"] : "12px", ["borderRadius"] : "12px", ["color"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/categories"?.valueOf?.()) ? "#fff" : "rgba(255, 255, 255, 0.7)"), ["transition"] : "all 0.3s", ["fontWeight"] : "500", ["width"] : "100%", ["textDecoration"] : "none", ["&:hover"] : ({ ["background"] : "rgba(255, 255, 255, 0.15)", ["color"] : "#fff" }), ["background"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/categories"?.valueOf?.()) ? "rgba(255, 255, 255, 0.15)" : "transparent"), ["borderLeft"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/categories"?.valueOf?.()) ? "4px solid #00c6ff" : "4px solid transparent") })},"Danh m\u1ee5c")))
  )
}


function Link_d2e3928980eb52a8a37ec7bfb0eb9f35 () {
  const reflex___state____state = useContext(StateContexts.reflex___state____state)



  return (
    jsx(RadixThemesLink,{asChild:true,css:({ ["width"] : "100%", ["&:hover"] : ({ ["color"] : "var(--accent-8)" }) }),underline:"none"},jsx(ReactRouterLink,{to:"/transactions"},jsx(RadixThemesBox,{css:({ ["display"] : "flex", ["alignItems"] : "center", ["padding"] : "14px 16px", ["marginBottom"] : "12px", ["borderRadius"] : "12px", ["color"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/transactions"?.valueOf?.()) ? "#fff" : "rgba(255, 255, 255, 0.7)"), ["transition"] : "all 0.3s", ["fontWeight"] : "500", ["width"] : "100%", ["textDecoration"] : "none", ["&:hover"] : ({ ["background"] : "rgba(255, 255, 255, 0.15)", ["color"] : "#fff" }), ["background"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/transactions"?.valueOf?.()) ? "rgba(255, 255, 255, 0.15)" : "transparent"), ["borderLeft"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/transactions"?.valueOf?.()) ? "4px solid #00c6ff" : "4px solid transparent") })},"Giao d\u1ecbch")))
  )
}


function Link_070b650423df8c43dd8e52b2f03a869f () {
  const reflex___state____state = useContext(StateContexts.reflex___state____state)



  return (
    jsx(RadixThemesLink,{asChild:true,css:({ ["width"] : "100%", ["&:hover"] : ({ ["color"] : "var(--accent-8)" }) }),underline:"none"},jsx(ReactRouterLink,{to:"/budgets"},jsx(RadixThemesBox,{css:({ ["display"] : "flex", ["alignItems"] : "center", ["padding"] : "14px 16px", ["marginBottom"] : "12px", ["borderRadius"] : "12px", ["color"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/budgets"?.valueOf?.()) ? "#fff" : "rgba(255, 255, 255, 0.7)"), ["transition"] : "all 0.3s", ["fontWeight"] : "500", ["width"] : "100%", ["textDecoration"] : "none", ["&:hover"] : ({ ["background"] : "rgba(255, 255, 255, 0.15)", ["color"] : "#fff" }), ["background"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/budgets"?.valueOf?.()) ? "rgba(255, 255, 255, 0.15)" : "transparent"), ["borderLeft"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/budgets"?.valueOf?.()) ? "4px solid #00c6ff" : "4px solid transparent") })},"Ng\u00e2n s\u00e1ch")))
  )
}


function Link_e5192abf4002ddd2787b9cc741b4ff17 () {
  const reflex___state____state = useContext(StateContexts.reflex___state____state)



  return (
    jsx(RadixThemesLink,{asChild:true,css:({ ["width"] : "100%", ["&:hover"] : ({ ["color"] : "var(--accent-8)" }) }),underline:"none"},jsx(ReactRouterLink,{to:"/reports"},jsx(RadixThemesBox,{css:({ ["display"] : "flex", ["alignItems"] : "center", ["padding"] : "14px 16px", ["marginBottom"] : "12px", ["borderRadius"] : "12px", ["color"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/reports"?.valueOf?.()) ? "#fff" : "rgba(255, 255, 255, 0.7)"), ["transition"] : "all 0.3s", ["fontWeight"] : "500", ["width"] : "100%", ["textDecoration"] : "none", ["&:hover"] : ({ ["background"] : "rgba(255, 255, 255, 0.15)", ["color"] : "#fff" }), ["background"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/reports"?.valueOf?.()) ? "rgba(255, 255, 255, 0.15)" : "transparent"), ["borderLeft"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/reports"?.valueOf?.()) ? "4px solid #00c6ff" : "4px solid transparent") })},"B\u00e1o c\u00e1o")))
  )
}


function Link_6b07ba62b01ccc01416cd0b873a0cf55 () {
  const reflex___state____state = useContext(StateContexts.reflex___state____state)



  return (
    jsx(RadixThemesLink,{asChild:true,css:({ ["width"] : "100%", ["&:hover"] : ({ ["color"] : "var(--accent-8)" }) }),underline:"none"},jsx(ReactRouterLink,{to:"/ai"},jsx(RadixThemesBox,{css:({ ["display"] : "flex", ["alignItems"] : "center", ["padding"] : "14px 16px", ["marginBottom"] : "12px", ["borderRadius"] : "12px", ["color"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/ai"?.valueOf?.()) ? "#fff" : "rgba(255, 255, 255, 0.7)"), ["transition"] : "all 0.3s", ["fontWeight"] : "500", ["width"] : "100%", ["textDecoration"] : "none", ["&:hover"] : ({ ["background"] : "rgba(255, 255, 255, 0.15)", ["color"] : "#fff" }), ["background"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/ai"?.valueOf?.()) ? "rgba(255, 255, 255, 0.15)" : "transparent"), ["borderLeft"] : ((reflex___state____state.router_rx_state_?.["page"]?.["path"]?.valueOf?.() === "/ai"?.valueOf?.()) ? "4px solid #00c6ff" : "4px solid transparent") })},"Tr\u1ee3 l\u00fd AI")))
  )
}


function Text_b35035b5c99a7af1fc15d789732b2a04 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)



  return (
    jsx(RadixThemesText,{as:"p",css:({ ["color"] : "#fff", ["fontWeight"] : "bold" }),size:"2"},reflex___state____state__spendee___app_state____app_state.username_rx_state_)
  )
}


function Button_bfebb9393a866e1c162fb1cb3aab554d () {
  const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_click_c03d739493b98c1addd5369b61a4116c = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.logout", ({  }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesButton,{css:({ ["background"] : "rgba(255, 255, 255, 0.1)", ["color"] : "#fff", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["width"] : "100%", ["marginTop"] : "10px", ["transition"] : "all 0.3s", ["&:hover"] : ({ ["background"] : "rgba(255, 71, 87, 0.8)" }) }),onClick:on_click_c03d739493b98c1addd5369b61a4116c,variant:"surface"},"\u0110\u0103ng xu\u1ea5t")
  )
}


function Select__content_bf38521f76e44ae27b37f1e9b3302c67 () {
  



  return (
    jsx(RadixThemesSelect.Content,{},Array.prototype.map.call(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] ?? [],((m_rx_state_,index_227c17b192003fea4a65b05ac462d949)=>(jsx(RadixThemesSelect.Item,{key:index_227c17b192003fea4a65b05ac462d949,value:m_rx_state_},m_rx_state_)))))
  )
}


function Select__root_22bdc1efe47a09ee4d1244bddac0c5af () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_04a6d450aac9f6be3ddd7a7456fb6878 = useCallback(((_ev_0) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_filter_month", ({ ["value"] : _ev_0 }), ({  })))], [_ev_0], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesSelect.Root,{onValueChange:on_change_04a6d450aac9f6be3ddd7a7456fb6878,value:reflex___state____state__spendee___app_state____app_state.filter_month_rx_state_},jsx(RadixThemesSelect.Trigger,{css:({ ["width"] : "100px" }),placeholder:"Th\u00e1ng"},),jsx(Select__content_bf38521f76e44ae27b37f1e9b3302c67,{},))
  )
}


function Select__content_6b34d83fdeb21fa173e93f1f3745bfd7 () {
  



  return (
    jsx(RadixThemesSelect.Content,{},Array.prototype.map.call(["2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034", "2035"] ?? [],((y_rx_state_,index_227c17b192003fea4a65b05ac462d949)=>(jsx(RadixThemesSelect.Item,{key:index_227c17b192003fea4a65b05ac462d949,value:y_rx_state_},y_rx_state_)))))
  )
}


function Select__root_dd81189840061508757df7b97b2ffb51 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_66f7adfc9e02df2a63529bc2e2a33a30 = useCallback(((_ev_0) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_filter_year", ({ ["value"] : _ev_0 }), ({  })))], [_ev_0], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesSelect.Root,{onValueChange:on_change_66f7adfc9e02df2a63529bc2e2a33a30,value:reflex___state____state__spendee___app_state____app_state.filter_year_rx_state_},jsx(RadixThemesSelect.Trigger,{css:({ ["width"] : "110px" }),placeholder:"N\u0103m"},),jsx(Select__content_6b34d83fdeb21fa173e93f1f3745bfd7,{},))
  )
}


function Button_399b9d0a853721b32d6b6720679e17d0 () {
  const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_click_64e2c4eab61bc5450db077083ae8bca6 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.apply_period", ({  }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesButton,{css:({ ["background"] : "linear-gradient(45deg, #00c6ff, #0072ff)", ["color"] : "white", ["border"] : "none" }),onClick:on_click_64e2c4eab61bc5450db077083ae8bca6,size:"2"},"\u00c1p d\u1ee5ng")
  )
}


function Select__content_e725143b69aea59ab9c99a06ba56fa6c () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)



  return (
    jsx(RadixThemesSelect.Content,{},Array.prototype.map.call(reflex___state____state__spendee___app_state____app_state.categories_rx_state_ ?? [],((c_rx_state_,index_8b6d94163ce4fe26fdee837be60dc62a)=>(jsx(RadixThemesSelect.Item,{key:index_8b6d94163ce4fe26fdee837be60dc62a,value:((c_rx_state_?.["id"]?.valueOf?.() === ""?.valueOf?.()) ? "0" : c_rx_state_?.["id"])},c_rx_state_?.["name"])))))
  )
}


function Select__root_a8dd7930f15f6314564d8233d68e2074 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_490bbce9c525ce162b7e7113077fb56a = useCallback(((_ev_0) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_b_category_id", ({ ["value"] : _ev_0 }), ({  })))], [_ev_0], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesSelect.Root,{onValueChange:on_change_490bbce9c525ce162b7e7113077fb56a,value:reflex___state____state__spendee___app_state____app_state.b_category_id_rx_state_},jsx(RadixThemesSelect.Trigger,{css:({ ["width"] : "240px" }),placeholder:"Danh m\u1ee5c"},),jsx(Select__content_e725143b69aea59ab9c99a06ba56fa6c,{},))
  )
}


function Debounceinput_d7dfc1629f278d572da88e841493ef8a () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_f3902113b960a3534b3710657fed12e7 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_b_amount", ({ ["value"] : _e?.["target"]?.["value"] }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(DebounceInput,{css:({ ["width"] : "200px" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_f3902113b960a3534b3710657fed12e7,placeholder:"H\u1ea1n m\u1ee9c (VN\u0110)",value:(isNotNullOrUndefined(reflex___state____state__spendee___app_state____app_state.b_amount_rx_state_) ? reflex___state____state__spendee___app_state____app_state.b_amount_rx_state_ : "")},)
  )
}


function Button_cac4039454e27ec9b06bd5d4a2105e2b () {
  const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_click_7c24c247c89f717438581a97cb8267b6 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.save_budget", ({  }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesButton,{color:"green",onClick:on_click_7c24c247c89f717438581a97cb8267b6},"L\u01b0u")
  )
}


function Button_9318b2d5237d0002e4330fd1050a37db () {
  const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_click_5de95dc730a4af3f6a792be50c10b6ce = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.load_budgets", ({  }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesButton,{onClick:on_click_5de95dc730a4af3f6a792be50c10b6ce,variant:"outline"},"T\u1ea3i l\u1ea1i ng\u00e2n s\u00e1ch")
  )
}


function Table__body_f4b0129290e394e6ea43977199327f0b () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)



  return (
    jsx(RadixThemesTable.Body,{},Array.prototype.map.call(reflex___state____state__spendee___app_state____app_state.budgets_rx_state_ ?? [],((b_rx_state_,index_b1e5cea8cd2acf9355ea6a1d95b41ca5)=>(jsx(RadixThemesTable.Row,{key:index_b1e5cea8cd2acf9355ea6a1d95b41ca5},jsx(RadixThemesTable.RowHeaderCell,{},b_rx_state_?.["category_name"]),jsx(RadixThemesTable.Cell,{},b_rx_state_?.["amount_limit"]),jsx(RadixThemesTable.Cell,{},b_rx_state_?.["actual_spent"]))))))
  )
}


export default function Component() {





  return (
    jsx(Fragment,{},jsx(Fragment,{},jsx(Toaster_11b04b7ca7e917be1c8df8032e226c05,{},),jsx(RadixThemesBox,{css:({ ["flex"] : "1", ["marginLeft"] : "260px", ["padding"] : "30px", ["minHeight"] : "100vh", ["background"] : "transparent" })},jsx(RadixThemesBox,{css:({ ["width"] : "260px", ["background"] : "rgba(255, 255, 255, 0.05)", ["backdropFilter"] : "blur(20px)", ["borderRight"] : "1px solid rgba(255, 255, 255, 0.1)", ["padding"] : "24px", ["height"] : "100vh", ["position"] : "fixed", ["top"] : "0", ["left"] : "0", ["zIndex"] : "10", ["display"] : "flex", ["flexDirection"] : "column" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["height"] : "100%", ["width"] : "100%", ["alignItems"] : "start" }),direction:"column",gap:"3"},jsx(RadixThemesBox,{css:({ ["marginBottom"] : "40px", ["width"] : "100%" })},jsx(RadixThemesHeading,{css:({ ["color"] : "#00c6ff", ["fontWeight"] : "bold" }),size:"6"},"Persional Budget"),jsx(RadixThemesText,{as:"p",css:({ ["color"] : "rgba(255, 255, 255, 0.6)" }),size:"2"},"Qu\u1ea3n l\u00fd chi ti\u00eau")),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%" }),direction:"column",gap:"1"},jsx(Link_015ce0ab41dba4ebe292742f7c0f121d,{},),jsx(Link_3e96be4e17ea2bbdc4d7bf09c8e79232,{},),jsx(Link_627970f042d85967af8da2972035db6c,{},),jsx(Link_d2e3928980eb52a8a37ec7bfb0eb9f35,{},),jsx(Link_070b650423df8c43dd8e52b2f03a869f,{},),jsx(Link_e5192abf4002ddd2787b9cc741b4ff17,{},),jsx(Link_6b07ba62b01ccc01416cd0b873a0cf55,{},)),jsx(RadixThemesFlex,{css:({ ["flex"] : 1, ["justifySelf"] : "stretch", ["alignSelf"] : "stretch" })},),jsx(RadixThemesBox,{css:({ ["paddingTop"] : "20px", ["borderTop"] : "1px solid rgba(255, 255, 255, 0.1)", ["marginTop"] : "auto", ["width"] : "100%" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",direction:"row",gap:"2"},jsx(RadixThemesText,{as:"p",css:({ ["color"] : "rgba(255, 255, 255, 0.6)" }),size:"2"},"User:"),jsx(Text_b35035b5c99a7af1fc15d789732b2a04,{},)),jsx(Button_bfebb9393a866e1c162fb1cb3aab554d,{},)))),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%", ["maxWidth"] : "1280px", ["alignItems"] : "stretch" }),direction:"column",gap:"4"},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["alignItems"] : "center", ["width"] : "100%", ["marginBottom"] : "4" }),direction:"row",justify:"between",gap:"3"},jsx(RadixThemesHeading,{css:({ ["color"] : "#fff", ["fontWeight"] : "bold" }),size:"7"},"Ng\u00e2n s\u00e1ch theo danh m\u1ee5c"),jsx(RadixThemesFlex,{css:({ ["flex"] : 1, ["justifySelf"] : "stretch", ["alignSelf"] : "stretch" })},)),jsx(RadixThemesBox,{css:({ ["background"] : "rgba(255, 255, 255, 0.08)", ["backdropFilter"] : "blur(20px)", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["borderRadius"] : "20px", ["color"] : "#fff", ["boxShadow"] : "0 10px 30px rgba(0,0,0,0.1)", ["padding"] : "15px 20px", ["marginBottom"] : "4" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["alignItems"] : "center", ["flexWrap"] : "wrap" }),direction:"row",gap:"4"},jsx(RadixThemesText,{as:"p",css:({ ["fontWeight"] : "500", ["color"] : "#fff" })},"Th\u00e1ng:"),jsx(Select__root_22bdc1efe47a09ee4d1244bddac0c5af,{},),jsx(RadixThemesText,{as:"p",css:({ ["fontWeight"] : "500", ["color"] : "#fff" })},"N\u0103m:"),jsx(Select__root_dd81189840061508757df7b97b2ffb51,{},),jsx(Button_399b9d0a853721b32d6b6720679e17d0,{},))),jsx(RadixThemesCard,{},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",direction:"column",gap:"3"},jsx(RadixThemesHeading,{size:"4"},"\u0110\u1eb7t / c\u1eadp nh\u1eadt h\u1ea1n m\u1ee9c"),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["flexWrap"] : "wrap", ["alignItems"] : "center" }),direction:"row",gap:"3"},jsx(Select__root_a8dd7930f15f6314564d8233d68e2074,{},),jsx(Debounceinput_d7dfc1629f278d572da88e841493ef8a,{},),jsx(Button_cac4039454e27ec9b06bd5d4a2105e2b,{},)))),jsx(Button_9318b2d5237d0002e4330fd1050a37db,{},),jsx(RadixThemesTable.Root,{css:({ ["width"] : "100%" }),size:"2",variant:"surface"},jsx(RadixThemesTable.Header,{},jsx(RadixThemesTable.Row,{},jsx(RadixThemesTable.ColumnHeaderCell,{},"Danh m\u1ee5c"),jsx(RadixThemesTable.ColumnHeaderCell,{},"H\u1ea1n m\u1ee9c"),jsx(RadixThemesTable.ColumnHeaderCell,{},"\u0110\u00e3 chi (trong th\u00e1ng)"))),jsx(Table__body_f4b0129290e394e6ea43977199327f0b,{},))))),jsx("title",{},"Ng\u00e2n s\u00e1ch"),jsx("meta",{content:"favicon.ico",property:"og:image"},))
  )
}