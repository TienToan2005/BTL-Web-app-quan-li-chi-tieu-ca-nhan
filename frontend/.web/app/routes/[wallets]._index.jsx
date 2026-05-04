import {Fragment,useCallback,useContext,useEffect} from "react"
import {ReflexEvent,isNotNullOrUndefined,refs} from "$/utils/state"
import {Toaster,toast} from "sonner"
import {ColorModeContext,EventLoopContext,StateContexts} from "$/utils/context"
import {Box as RadixThemesBox,Button as RadixThemesButton,Flex as RadixThemesFlex,Heading as RadixThemesHeading,Link as RadixThemesLink,Select as RadixThemesSelect,Table as RadixThemesTable,Text as RadixThemesText,TextField as RadixThemesTextField} from "@radix-ui/themes"
import {Link as ReactRouterLink} from "react-router"
import DebounceInput from "react-debounce-input"
import {DynamicIcon} from "lucide-react/dynamic.mjs"
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


function Debounceinput_044ddd5e1838ec59eb5acef84ab462c7 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_78a95779a389cf5341e9803028f6b630 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_w_name", ({ ["value"] : _e?.["target"]?.["value"] }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(DebounceInput,{css:({ ["width"] : "100%" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_78a95779a389cf5341e9803028f6b630,placeholder:"VD: Ti\u1ec1n m\u1eb7t, Th\u1ebb t\u00edn d\u1ee5ng...",value:(isNotNullOrUndefined(reflex___state____state__spendee___app_state____app_state.w_name_rx_state_) ? reflex___state____state__spendee___app_state____app_state.w_name_rx_state_ : "")},)
  )
}


function Debounceinput_62672422186a7a88b51a11de63576efd () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_3517f11aadc8de2be50ef06fcc458e41 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_w_balance", ({ ["value"] : _e?.["target"]?.["value"] }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(DebounceInput,{css:({ ["width"] : "100%" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_3517f11aadc8de2be50ef06fcc458e41,placeholder:"0",value:(isNotNullOrUndefined(reflex___state____state__spendee___app_state____app_state.w_balance_rx_state_) ? reflex___state____state__spendee___app_state____app_state.w_balance_rx_state_ : "")},)
  )
}


function Select__root_9f87f1be990c9e6d6896b394ad2f568b () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_7d06c623db3edfb96a70bca877a77178 = useCallback(((_ev_0) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_w_icon", ({ ["value"] : _ev_0 }), ({  })))], [_ev_0], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesSelect.Root,{onValueChange:on_change_7d06c623db3edfb96a70bca877a77178,value:reflex___state____state__spendee___app_state____app_state.w_icon_rx_state_},jsx(RadixThemesSelect.Trigger,{css:({ ["width"] : "100%" }),placeholder:"Ch\u1ecdn bi\u1ec3u t\u01b0\u1ee3ng"},),jsx(RadixThemesSelect.Content,{},jsx(RadixThemesSelect.Item,{value:"wallet"},"V\u00ed ti\u1ec1n m\u1eb7t"),jsx(RadixThemesSelect.Item,{value:"credit-card"},"Th\u1ebb t\u00edn d\u1ee5ng"),jsx(RadixThemesSelect.Item,{value:"landmark"},"Ng\u00e2n h\u00e0ng"),jsx(RadixThemesSelect.Item,{value:"piggy-bank"},"Heo \u0111\u1ea5t")))
  )
}


function Select__root_5869ee8c8c7379e5417828f777832bd9 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_3dc2f1c9cb37c5a1d39389d5094d12fc = useCallback(((_ev_0) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_w_color", ({ ["value"] : _ev_0 }), ({  })))], [_ev_0], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesSelect.Root,{onValueChange:on_change_3dc2f1c9cb37c5a1d39389d5094d12fc,value:reflex___state____state__spendee___app_state____app_state.w_color_rx_state_},jsx(RadixThemesSelect.Trigger,{css:({ ["width"] : "100%" }),placeholder:"Ch\u1ecdn m\u00e0u s\u1eafc"},),jsx(RadixThemesSelect.Content,{},jsx(RadixThemesSelect.Item,{value:"#00e676"},"Xanh l\u00e1"),jsx(RadixThemesSelect.Item,{value:"#00c6ff"},"Xanh d\u01b0\u01a1ng"),jsx(RadixThemesSelect.Item,{value:"#ff4757"},"\u0110\u1ecf"),jsx(RadixThemesSelect.Item,{value:"#ffa502"},"Cam"),jsx(RadixThemesSelect.Item,{value:"#9b59b6"},"T\u00edm")))
  )
}


function Button_5dd6fa057ccfb29a5060ec2626064a01 () {
  const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_click_406a07cd21e8ad8133d02f507f3f88d9 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.create_wallet", ({  }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesButton,{css:({ ["background"] : "linear-gradient(45deg, #00c6ff, #0072ff)", ["color"] : "white", ["border"] : "none", ["width"] : "100%", ["marginTop"] : "4" }),onClick:on_click_406a07cd21e8ad8133d02f507f3f88d9,variant:"solid"},"L\u01b0u v\u00ed")
  )
}


function Table__body_c37d0babd091a1eb2a1af2146ba1db88 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);



  return (
    jsx(RadixThemesTable.Body,{},Array.prototype.map.call(reflex___state____state__spendee___app_state____app_state.wallets_rx_state_ ?? [],((w_rx_state_,index_aede9624622712bdd59a357d1377ecdc)=>(jsx(RadixThemesTable.Row,{css:({ ["&:hover"] : ({ ["background"] : "rgba(255,255,255,0.1)" }) }),key:index_aede9624622712bdd59a357d1377ecdc},jsx(RadixThemesTable.Cell,{css:({ ["color"] : "#fff", ["borderBottom"] : "1px solid rgba(255,255,255,0.05)" })},jsx(DynamicIcon,{css:({ ["color"] : "rgba(255,255,255,0.7)" }),name:w_rx_state_?.["icon"].replaceAll("_", "-"),size:20},)),jsx(RadixThemesTable.RowHeaderCell,{css:({ ["color"] : "#fff", ["borderBottom"] : "1px solid rgba(255,255,255,0.05)" })},w_rx_state_?.["name"]),jsx(RadixThemesTable.Cell,{css:({ ["color"] : "#fff", ["borderBottom"] : "1px solid rgba(255,255,255,0.05)" })},w_rx_state_?.["balance"]),jsx(RadixThemesTable.Cell,{css:({ ["color"] : "#fff", ["borderBottom"] : "1px solid rgba(255,255,255,0.05)" })},jsx(RadixThemesBox,{css:({ ["width"] : "24px", ["height"] : "24px", ["borderRadius"] : "6px", ["backgroundColor"] : w_rx_state_?.["color"], ["boxShadow"] : "0 2px 5px rgba(0,0,0,0.2)" })},)),jsx(RadixThemesTable.Cell,{css:({ ["color"] : "#fff", ["borderBottom"] : "1px solid rgba(255,255,255,0.05)" })},jsx(RadixThemesButton,{color:"red",onClick:((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.delete_wallet", ({ ["wallet_id"] : w_rx_state_?.["id"] }), ({  })))], [_e], ({  })))),size:"1",variant:"soft"},"X\u00f3a")))))))
  )
}


export default function Component() {





  return (
    jsx(Fragment,{},jsx(Fragment,{},jsx(Toaster_11b04b7ca7e917be1c8df8032e226c05,{},),jsx(RadixThemesBox,{css:({ ["flex"] : "1", ["marginLeft"] : "260px", ["padding"] : "30px", ["minHeight"] : "100vh", ["background"] : "transparent" })},jsx(RadixThemesBox,{css:({ ["width"] : "260px", ["background"] : "rgba(255, 255, 255, 0.05)", ["backdropFilter"] : "blur(20px)", ["borderRight"] : "1px solid rgba(255, 255, 255, 0.1)", ["padding"] : "24px", ["height"] : "100vh", ["position"] : "fixed", ["top"] : "0", ["left"] : "0", ["zIndex"] : "10", ["display"] : "flex", ["flexDirection"] : "column" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["height"] : "100%", ["width"] : "100%", ["alignItems"] : "start" }),direction:"column",gap:"3"},jsx(RadixThemesBox,{css:({ ["marginBottom"] : "40px", ["width"] : "100%" })},jsx(RadixThemesHeading,{css:({ ["color"] : "#00c6ff", ["fontWeight"] : "bold" }),size:"6"},"Persional Budget"),jsx(RadixThemesText,{as:"p",css:({ ["color"] : "rgba(255, 255, 255, 0.6)" }),size:"2"},"Qu\u1ea3n l\u00fd chi ti\u00eau")),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%" }),direction:"column",gap:"1"},jsx(Link_015ce0ab41dba4ebe292742f7c0f121d,{},),jsx(Link_3e96be4e17ea2bbdc4d7bf09c8e79232,{},),jsx(Link_627970f042d85967af8da2972035db6c,{},),jsx(Link_d2e3928980eb52a8a37ec7bfb0eb9f35,{},),jsx(Link_070b650423df8c43dd8e52b2f03a869f,{},),jsx(Link_e5192abf4002ddd2787b9cc741b4ff17,{},),jsx(Link_6b07ba62b01ccc01416cd0b873a0cf55,{},)),jsx(RadixThemesFlex,{css:({ ["flex"] : 1, ["justifySelf"] : "stretch", ["alignSelf"] : "stretch" })},),jsx(RadixThemesBox,{css:({ ["paddingTop"] : "20px", ["borderTop"] : "1px solid rgba(255, 255, 255, 0.1)", ["marginTop"] : "auto", ["width"] : "100%" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",direction:"row",gap:"2"},jsx(RadixThemesText,{as:"p",css:({ ["color"] : "rgba(255, 255, 255, 0.6)" }),size:"2"},"User:"),jsx(Text_b35035b5c99a7af1fc15d789732b2a04,{},)),jsx(Button_bfebb9393a866e1c162fb1cb3aab554d,{},)))),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%", ["maxWidth"] : "1280px", ["alignItems"] : "stretch" }),direction:"column",gap:"4"},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["alignItems"] : "center", ["width"] : "100%", ["marginBottom"] : "4" }),direction:"row",justify:"between",gap:"3"},jsx(RadixThemesHeading,{css:({ ["color"] : "#fff", ["fontWeight"] : "bold" }),size:"7"},"V\u00ed c\u1ee7a b\u1ea1n"),jsx(RadixThemesFlex,{css:({ ["flex"] : 1, ["justifySelf"] : "stretch", ["alignSelf"] : "stretch" })},)),jsx(RadixThemesBox,{css:({ ["background"] : "rgba(255, 255, 255, 0.08)", ["backdropFilter"] : "blur(20px)", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["borderRadius"] : "20px", ["boxShadow"] : "0 10px 30px rgba(0,0,0,0.1)", ["padding"] : "24px", ["color"] : "#fff", ["width"] : "100%", ["maxWidth"] : "400px", ["marginBottom"] : "6" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["alignItems"] : "start" }),direction:"column",gap:"3"},jsx(RadixThemesHeading,{css:({ ["color"] : "white", ["marginBottom"] : "8px" }),size:"5"},"Th\u00eam v\u00ed m\u1edbi"),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%" }),direction:"column",gap:"1"},jsx(RadixThemesText,{as:"p",css:({ ["fontSize"] : "0.85rem", ["color"] : "rgba(255, 255, 255, 0.7)", ["marginBottom"] : "4px", ["fontWeight"] : "500" })},"T\u00ean v\u00ed"),jsx(Debounceinput_044ddd5e1838ec59eb5acef84ab462c7,{},)),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%" }),direction:"column",gap:"1"},jsx(RadixThemesText,{as:"p",css:({ ["fontSize"] : "0.85rem", ["color"] : "rgba(255, 255, 255, 0.7)", ["marginBottom"] : "4px", ["fontWeight"] : "500" })},"S\u1ed1 d\u01b0 ban \u0111\u1ea7u (VN\u0110)"),jsx(Debounceinput_62672422186a7a88b51a11de63576efd,{},)),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%" }),direction:"column",gap:"1"},jsx(RadixThemesText,{as:"p",css:({ ["fontSize"] : "0.85rem", ["color"] : "rgba(255, 255, 255, 0.7)", ["marginBottom"] : "4px", ["fontWeight"] : "500" })},"Bi\u1ec3u t\u01b0\u1ee3ng (Icon)"),jsx(Select__root_9f87f1be990c9e6d6896b394ad2f568b,{},)),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%" }),direction:"column",gap:"1"},jsx(RadixThemesText,{as:"p",css:({ ["fontSize"] : "0.85rem", ["color"] : "rgba(255, 255, 255, 0.7)", ["marginBottom"] : "4px", ["fontWeight"] : "500" })},"M\u00e0u hi\u1ec3n th\u1ecb"),jsx(Select__root_5869ee8c8c7379e5417828f777832bd9,{},)),jsx(Button_5dd6fa057ccfb29a5060ec2626064a01,{},))),jsx(RadixThemesBox,{css:({ ["background"] : "rgba(255, 255, 255, 0.08)", ["backdropFilter"] : "blur(20px)", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["borderRadius"] : "20px", ["boxShadow"] : "0 10px 30px rgba(0,0,0,0.1)", ["padding"] : "0", ["color"] : "#fff", ["overflow"] : "hidden", ["width"] : "100%" })},jsx(RadixThemesTable.Root,{css:({ ["background"] : "transparent", ["width"] : "100%" }),size:"2",variant:"surface"},jsx(RadixThemesTable.Header,{},jsx(RadixThemesTable.Row,{},jsx(RadixThemesTable.ColumnHeaderCell,{css:({ ["color"] : "rgba(255,255,255,0.7)", ["borderBottom"] : "1px solid rgba(255,255,255,0.1)" })},"Icon"),jsx(RadixThemesTable.ColumnHeaderCell,{css:({ ["color"] : "rgba(255,255,255,0.7)", ["borderBottom"] : "1px solid rgba(255,255,255,0.1)" })},"T\u00ean v\u00ed"),jsx(RadixThemesTable.ColumnHeaderCell,{css:({ ["color"] : "rgba(255,255,255,0.7)", ["borderBottom"] : "1px solid rgba(255,255,255,0.1)" })},"S\u1ed1 d\u01b0"),jsx(RadixThemesTable.ColumnHeaderCell,{css:({ ["color"] : "rgba(255,255,255,0.7)", ["borderBottom"] : "1px solid rgba(255,255,255,0.1)" })},"M\u00e0u"),jsx(RadixThemesTable.ColumnHeaderCell,{css:({ ["color"] : "rgba(255,255,255,0.7)", ["borderBottom"] : "1px solid rgba(255,255,255,0.1)" })},""))),jsx(Table__body_c37d0babd091a1eb2a1af2146ba1db88,{},)))))),jsx("title",{},"V\u00ed"),jsx("meta",{content:"favicon.ico",property:"og:image"},))
  )
}