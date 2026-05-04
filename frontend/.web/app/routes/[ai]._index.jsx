import {Fragment,useCallback,useContext,useEffect} from "react"
import {ReflexEvent,isNotNullOrUndefined,refs} from "$/utils/state"
import {Toaster,toast} from "sonner"
import {ColorModeContext,EventLoopContext,StateContexts} from "$/utils/context"
import {Badge as RadixThemesBadge,Box as RadixThemesBox,Button as RadixThemesButton,Flex as RadixThemesFlex,Grid as RadixThemesGrid,Heading as RadixThemesHeading,Link as RadixThemesLink,Select as RadixThemesSelect,Text as RadixThemesText,TextField as RadixThemesTextField} from "@radix-ui/themes"
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


function Button_003a0c9375d4deb127c79e60b1c16858 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_click_ae9ccd739e3885e9f7ac4dd866043431 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.fetch_ai_advice", ({  }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesButton,{css:({ ["background"] : "linear-gradient(45deg, #00e676, #00c853)", ["color"] : "white", ["width"] : "100%" }),loading:reflex___state____state__spendee___app_state____app_state.ai_loading_rx_state_,onClick:on_click_ae9ccd739e3885e9f7ac4dd866043431},"Ph\u00e2n t\u00edch & t\u01b0 v\u1ea5n")
  )
}


function Text_5bfdc2ca787a1516e3aec99e991b58f4 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)



  return (
    jsx(RadixThemesText,{as:"p"},reflex___state____state__spendee___app_state____app_state.ai_advice_rx_state_)
  )
}


function Flex_bb774ae388318d96ab5e52819be20bea () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)



  return (
    jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["paddingRight"] : "10px", ["width"] : "100%", ["maxHeight"] : "300px", ["overflowY"] : "auto" }),direction:"column",gap:"1"},Array.prototype.map.call(reflex___state____state__spendee___app_state____app_state.chat_messages_rx_state_ ?? [],((m_rx_state_,index_51d3b238c4ce2e141f1f8a42bc1f158a)=>(jsx(RadixThemesBox,{css:({ ["padding"] : "3", ["borderRadius"] : "12px", ["background"] : "rgba(255, 255, 255, 0.1)", ["marginBottom"] : "2", ["width"] : "100%" }),key:index_51d3b238c4ce2e141f1f8a42bc1f158a},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["alignItems"] : "start" }),direction:"column",gap:"3"},jsx(RadixThemesBadge,{color:"blue",css:({ ["marginBottom"] : "5px" }),variant:"soft"},m_rx_state_?.["role"]),jsx(RadixThemesText,{as:"p",css:({ ["color"] : "white" }),size:"2"},m_rx_state_?.["content"])))))))
  )
}


function Debounceinput_9f652cc81bb79a122f260dff1868ebf2 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_cd1428fbd4b5498357907c07af80e3fd = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_chat_input", ({ ["value"] : _e?.["target"]?.["value"] }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(DebounceInput,{css:({ ["background"] : "rgba(255,255,255,0.1)", ["border"] : "none", ["color"] : "white", ["flex"] : "1" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_cd1428fbd4b5498357907c07af80e3fd,placeholder:"H\u1ecfi v\u1ec1 chi ti\u00eau...",value:(isNotNullOrUndefined(reflex___state____state__spendee___app_state____app_state.chat_input_rx_state_) ? reflex___state____state__spendee___app_state____app_state.chat_input_rx_state_ : "")},)
  )
}


function Button_d0df3bd5aa3d362e015db4ca8c81d1d2 () {
  const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_click_9768154aaa5fe85f3285722214fbda7b = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.send_chat", ({  }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesButton,{css:({ ["background"] : "#00c6ff", ["color"] : "white" }),onClick:on_click_9768154aaa5fe85f3285722214fbda7b},"G\u1eedi")
  )
}


export default function Component() {





  return (
    jsx(Fragment,{},jsx(Fragment,{},jsx(Toaster_11b04b7ca7e917be1c8df8032e226c05,{},),jsx(RadixThemesBox,{css:({ ["flex"] : "1", ["marginLeft"] : "260px", ["padding"] : "30px", ["minHeight"] : "100vh", ["background"] : "transparent" })},jsx(RadixThemesBox,{css:({ ["width"] : "260px", ["background"] : "rgba(255, 255, 255, 0.05)", ["backdropFilter"] : "blur(20px)", ["borderRight"] : "1px solid rgba(255, 255, 255, 0.1)", ["padding"] : "24px", ["height"] : "100vh", ["position"] : "fixed", ["top"] : "0", ["left"] : "0", ["zIndex"] : "10", ["display"] : "flex", ["flexDirection"] : "column" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["height"] : "100%", ["width"] : "100%", ["alignItems"] : "start" }),direction:"column",gap:"3"},jsx(RadixThemesBox,{css:({ ["marginBottom"] : "40px", ["width"] : "100%" })},jsx(RadixThemesHeading,{css:({ ["color"] : "#00c6ff", ["fontWeight"] : "bold" }),size:"6"},"Persional Budget"),jsx(RadixThemesText,{as:"p",css:({ ["color"] : "rgba(255, 255, 255, 0.6)" }),size:"2"},"Qu\u1ea3n l\u00fd chi ti\u00eau")),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%" }),direction:"column",gap:"1"},jsx(Link_015ce0ab41dba4ebe292742f7c0f121d,{},),jsx(Link_3e96be4e17ea2bbdc4d7bf09c8e79232,{},),jsx(Link_627970f042d85967af8da2972035db6c,{},),jsx(Link_d2e3928980eb52a8a37ec7bfb0eb9f35,{},),jsx(Link_070b650423df8c43dd8e52b2f03a869f,{},),jsx(Link_e5192abf4002ddd2787b9cc741b4ff17,{},),jsx(Link_6b07ba62b01ccc01416cd0b873a0cf55,{},)),jsx(RadixThemesFlex,{css:({ ["flex"] : 1, ["justifySelf"] : "stretch", ["alignSelf"] : "stretch" })},),jsx(RadixThemesBox,{css:({ ["paddingTop"] : "20px", ["borderTop"] : "1px solid rgba(255, 255, 255, 0.1)", ["marginTop"] : "auto", ["width"] : "100%" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",direction:"row",gap:"2"},jsx(RadixThemesText,{as:"p",css:({ ["color"] : "rgba(255, 255, 255, 0.6)" }),size:"2"},"User:"),jsx(Text_b35035b5c99a7af1fc15d789732b2a04,{},)),jsx(Button_bfebb9393a866e1c162fb1cb3aab554d,{},)))),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%", ["maxWidth"] : "1280px", ["alignItems"] : "stretch" }),direction:"column",gap:"4"},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["alignItems"] : "center", ["width"] : "100%", ["marginBottom"] : "4" }),direction:"row",justify:"between",gap:"3"},jsx(RadixThemesHeading,{css:({ ["color"] : "#fff", ["fontWeight"] : "bold" }),size:"7"},"Tr\u1ee3 l\u00fd AI"),jsx(RadixThemesFlex,{css:({ ["flex"] : 1, ["justifySelf"] : "stretch", ["alignSelf"] : "stretch" })},)),jsx(RadixThemesBox,{css:({ ["background"] : "rgba(255, 255, 255, 0.08)", ["backdropFilter"] : "blur(20px)", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["borderRadius"] : "20px", ["color"] : "#fff", ["boxShadow"] : "0 10px 30px rgba(0,0,0,0.1)", ["padding"] : "15px 20px", ["marginBottom"] : "4" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["alignItems"] : "center", ["flexWrap"] : "wrap" }),direction:"row",gap:"4"},jsx(RadixThemesText,{as:"p",css:({ ["fontWeight"] : "500", ["color"] : "#fff" })},"Th\u00e1ng:"),jsx(Select__root_22bdc1efe47a09ee4d1244bddac0c5af,{},),jsx(RadixThemesText,{as:"p",css:({ ["fontWeight"] : "500", ["color"] : "#fff" })},"N\u0103m:"),jsx(Select__root_dd81189840061508757df7b97b2ffb51,{},),jsx(Button_399b9d0a853721b32d6b6720679e17d0,{},))),jsx(RadixThemesGrid,{columns:"2",css:({ ["width"] : "100%" }),gap:"4"},jsx(RadixThemesBox,{css:({ ["background"] : "rgba(255, 255, 255, 0.08)", ["backdropFilter"] : "blur(20px)", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["borderRadius"] : "20px", ["padding"] : "24px", ["color"] : "#fff" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["alignItems"] : "stretch" }),direction:"column",gap:"3"},jsx(RadixThemesHeading,{css:({ ["color"] : "white" }),size:"4"},"L\u1eddi khuy\u00ean theo th\u00e1ng"),jsx(Button_003a0c9375d4deb127c79e60b1c16858,{},),jsx(RadixThemesBox,{css:({ ["whiteSpace"] : "pre-wrap", ["fontSize"] : "0.9rem", ["color"] : "rgba(255,255,255,0.9)", ["padding"] : "4", ["borderRadius"] : "12px", ["background"] : "rgba(255, 255, 255, 0.05)", ["minHeight"] : "150px" })},jsx(Text_5bfdc2ca787a1516e3aec99e991b58f4,{},)))),jsx(RadixThemesBox,{css:({ ["background"] : "rgba(255, 255, 255, 0.08)", ["backdropFilter"] : "blur(20px)", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["borderRadius"] : "20px", ["padding"] : "24px", ["color"] : "#fff" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["alignItems"] : "stretch" }),direction:"column",gap:"3"},jsx(RadixThemesHeading,{css:({ ["color"] : "white" }),size:"4"},"Chat v\u1edbi Personal Budget AI"),jsx(Flex_bb774ae388318d96ab5e52819be20bea,{},),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%" }),direction:"row",gap:"2"},jsx(Debounceinput_9f652cc81bb79a122f260dff1868ebf2,{},),jsx(Button_d0df3bd5aa3d362e015db4ca8c81d1d2,{},)))))))),jsx("title",{},"AI"),jsx("meta",{content:"favicon.ico",property:"og:image"},))
  )
}