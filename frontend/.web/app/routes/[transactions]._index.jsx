import {Fragment,useCallback,useContext,useEffect,useRef} from "react"
import {ReflexEvent,isNotNullOrUndefined,refs} from "$/utils/state"
import {Toaster,toast} from "sonner"
import {ColorModeContext,EventLoopContext,StateContexts} from "$/utils/context"
import {Box as RadixThemesBox,Button as RadixThemesButton,Flex as RadixThemesFlex,Heading as RadixThemesHeading,Link as RadixThemesLink,Select as RadixThemesSelect,Table as RadixThemesTable,Text as RadixThemesText,TextField as RadixThemesTextField} from "@radix-ui/themes"
import {Link as ReactRouterLink} from "react-router"
import DebounceInput from "react-debounce-input"
import {} from "react-dropzone"
import {useDropzone} from "react-dropzone"
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


function Select__content_e725143b69aea59ab9c99a06ba56fa6c () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)



  return (
    jsx(RadixThemesSelect.Content,{},Array.prototype.map.call(reflex___state____state__spendee___app_state____app_state.categories_rx_state_ ?? [],((c_rx_state_,index_8b6d94163ce4fe26fdee837be60dc62a)=>(jsx(RadixThemesSelect.Item,{key:index_8b6d94163ce4fe26fdee837be60dc62a,value:((c_rx_state_?.["id"]?.valueOf?.() === ""?.valueOf?.()) ? "0" : c_rx_state_?.["id"])},c_rx_state_?.["name"])))))
  )
}


function Select__root_197c58de47d0bccd51b13838e431c9f4 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_55a8c9a90c5874773e9319b116cf43e6 = useCallback(((_ev_0) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_s_category_id", ({ ["value"] : _ev_0 }), ({  })))], [_ev_0], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesSelect.Root,{onValueChange:on_change_55a8c9a90c5874773e9319b116cf43e6,value:reflex___state____state__spendee___app_state____app_state.s_category_id_rx_state_},jsx(RadixThemesSelect.Trigger,{css:({ ["width"] : "200px" }),placeholder:"Danh m\u1ee5c (t\u1ea5t c\u1ea3)"},),jsx(Select__content_e725143b69aea59ab9c99a06ba56fa6c,{},))
  )
}


function Select__content_3574036c23fc749a50dde5d9a6d5b0b3 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)



  return (
    jsx(RadixThemesSelect.Content,{},Array.prototype.map.call(reflex___state____state__spendee___app_state____app_state.wallets_rx_state_ ?? [],((w_rx_state_,index_8b6d94163ce4fe26fdee837be60dc62a)=>(jsx(RadixThemesSelect.Item,{key:index_8b6d94163ce4fe26fdee837be60dc62a,value:((w_rx_state_?.["id"]?.valueOf?.() === ""?.valueOf?.()) ? "0" : w_rx_state_?.["id"])},w_rx_state_?.["name"])))))
  )
}


function Select__root_1100c17ae78418d44d464e6296247811 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_d01629da9fbd20ad4963a25d30ac7177 = useCallback(((_ev_0) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_s_wallet_id", ({ ["value"] : _ev_0 }), ({  })))], [_ev_0], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesSelect.Root,{onValueChange:on_change_d01629da9fbd20ad4963a25d30ac7177,value:reflex___state____state__spendee___app_state____app_state.s_wallet_id_rx_state_},jsx(RadixThemesSelect.Trigger,{css:({ ["width"] : "180px" }),placeholder:"V\u00ed (t\u1ea5t c\u1ea3)"},),jsx(Select__content_3574036c23fc749a50dde5d9a6d5b0b3,{},))
  )
}


function Debounceinput_d87655a49b96229f89755bfd0201f8e0 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_f294eacfb853b3b2cd8a2c74bae96999 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_s_note", ({ ["value"] : _e?.["target"]?.["value"] }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(DebounceInput,{css:({ ["width"] : "200px" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_f294eacfb853b3b2cd8a2c74bae96999,placeholder:"Ghi ch\u00fa ch\u1ee9a...",value:(isNotNullOrUndefined(reflex___state____state__spendee___app_state____app_state.s_note_rx_state_) ? reflex___state____state__spendee___app_state____app_state.s_note_rx_state_ : "")},)
  )
}


function Debounceinput_21b3014abad06d510332490c68c3d825 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_fd63a8bd0e63fa271d0572639fdbdae5 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_s_start", ({ ["value"] : _e?.["target"]?.["value"] }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(DebounceInput,{css:({ ["width"] : "160px" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_fd63a8bd0e63fa271d0572639fdbdae5,type:"date",value:(isNotNullOrUndefined(reflex___state____state__spendee___app_state____app_state.s_start_rx_state_) ? reflex___state____state__spendee___app_state____app_state.s_start_rx_state_ : "")},)
  )
}


function Debounceinput_23185f4d99072485dd6a28406d011d47 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_08a7e2bbd447acfd0ef85c74e30cafd3 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_s_end", ({ ["value"] : _e?.["target"]?.["value"] }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(DebounceInput,{css:({ ["width"] : "160px" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_08a7e2bbd447acfd0ef85c74e30cafd3,type:"date",value:(isNotNullOrUndefined(reflex___state____state__spendee___app_state____app_state.s_end_rx_state_) ? reflex___state____state__spendee___app_state____app_state.s_end_rx_state_ : "")},)
  )
}


function Button_e488b015f1f710ed712ec360ed96f030 () {
  const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_click_4aa194f736294c33231bd773cb6b682d = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.search_transactions", ({  }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesButton,{css:({ ["background"] : "linear-gradient(45deg, #00c6ff, #0072ff)", ["color"] : "white", ["border"] : "none" }),onClick:on_click_4aa194f736294c33231bd773cb6b682d,variant:"solid"},"L\u1ecdc")
  )
}


function Select__content_f467612b267956ce30400ab574c8872b () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)



  return (
    jsx(RadixThemesSelect.Content,{},Array.prototype.map.call(reflex___state____state__spendee___app_state____app_state.wallets_rx_state_ ?? [],((w_rx_state_,index_8f51835d97942ed32815b5b15c1cac1a)=>(jsx(RadixThemesSelect.Item,{key:index_8f51835d97942ed32815b5b15c1cac1a,value:w_rx_state_?.["id"]},w_rx_state_?.["name"])))))
  )
}


function Select__root_fbe359ba5017f345c5782b28c6e94b45 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_5bf9a2461faba5bcb277862a32e91c91 = useCallback(((_ev_0) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_t_wallet_id", ({ ["value"] : _ev_0 }), ({  })))], [_ev_0], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesSelect.Root,{onValueChange:on_change_5bf9a2461faba5bcb277862a32e91c91,value:reflex___state____state__spendee___app_state____app_state.t_wallet_id_rx_state_},jsx(RadixThemesSelect.Trigger,{css:({ ["width"] : "180px" }),placeholder:"V\u00ed"},),jsx(Select__content_f467612b267956ce30400ab574c8872b,{},))
  )
}


function Select__content_eb8574350d905dd13cda7bca30ac461f () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)



  return (
    jsx(RadixThemesSelect.Content,{},Array.prototype.map.call(reflex___state____state__spendee___app_state____app_state.categories_rx_state_ ?? [],((c_rx_state_,index_8f51835d97942ed32815b5b15c1cac1a)=>(jsx(RadixThemesSelect.Item,{key:index_8f51835d97942ed32815b5b15c1cac1a,value:c_rx_state_?.["id"]},c_rx_state_?.["name"])))))
  )
}


function Select__root_d7ee8cb8765f7316db06fa3413448c77 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_31b03103a0d1a633efb81878e32a71d4 = useCallback(((_ev_0) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_t_category_id", ({ ["value"] : _ev_0 }), ({  })))], [_ev_0], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesSelect.Root,{onValueChange:on_change_31b03103a0d1a633efb81878e32a71d4,value:reflex___state____state__spendee___app_state____app_state.t_category_id_rx_state_},jsx(RadixThemesSelect.Trigger,{css:({ ["width"] : "200px" }),placeholder:"Danh m\u1ee5c"},),jsx(Select__content_eb8574350d905dd13cda7bca30ac461f,{},))
  )
}


function Debounceinput_d439f7dce5a46004eb88e216b9837a2b () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_50a6e4d761012324c40f50e3be026d86 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_t_amount", ({ ["value"] : _e?.["target"]?.["value"] }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(DebounceInput,{css:({ ["width"] : "140px" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_50a6e4d761012324c40f50e3be026d86,placeholder:"S\u1ed1 ti\u1ec1n",value:(isNotNullOrUndefined(reflex___state____state__spendee___app_state____app_state.t_amount_rx_state_) ? reflex___state____state__spendee___app_state____app_state.t_amount_rx_state_ : "")},)
  )
}


function Debounceinput_aa80047349d2449dc026bd8986f1bd9f () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_debb7716155e6cf084daa30c8f80fdf3 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_t_date", ({ ["value"] : _e?.["target"]?.["value"] }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(DebounceInput,{css:({ ["width"] : "160px" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_debb7716155e6cf084daa30c8f80fdf3,type:"date",value:(isNotNullOrUndefined(reflex___state____state__spendee___app_state____app_state.t_date_rx_state_) ? reflex___state____state__spendee___app_state____app_state.t_date_rx_state_ : "")},)
  )
}


function Debounceinput_501963f7fbdaaee8d24392028ac289ea () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_change_68e9c8af0d9dd039a7cec4cf3be7b897 = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.set_t_note", ({ ["value"] : _e?.["target"]?.["value"] }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(DebounceInput,{css:({ ["width"] : "100%" }),debounceTimeout:300,element:RadixThemesTextField.Root,onChange:on_change_68e9c8af0d9dd039a7cec4cf3be7b897,placeholder:"Ghi ch\u00fa",value:(isNotNullOrUndefined(reflex___state____state__spendee___app_state____app_state.t_note_rx_state_) ? reflex___state____state__spendee___app_state____app_state.t_note_rx_state_ : "")},)
  )
}


function Button_f53be03ded3b5804b9335f7b6057d6a8 () {
  const [addEvents, connectErrors] = useContext(EventLoopContext);

const on_click_7a0ce233368f249798dfa3bd291e66bf = useCallback(((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.create_transaction", ({  }), ({  })))], [_e], ({  })))), [addEvents, ReflexEvent])

  return (
    jsx(RadixThemesButton,{css:({ ["background"] : "linear-gradient(45deg, #00c6ff, #0072ff)", ["color"] : "white", ["border"] : "none" }),onClick:on_click_7a0ce233368f249798dfa3bd291e66bf,variant:"solid"},"Ghi nh\u1eadn")
  )
}


function Comp_dfd0beed9e31430f41446ccb2f708e39 () {
  const ref_receipt_upload = useRef(null); refs["ref_receipt_upload"] = ref_receipt_upload;
const [addEvents, connectErrors] = useContext(EventLoopContext);
const on_drop_deed11cff8f940d3faa39fb07cb5e8af = useCallback(((_ev_0) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.upload_receipt", ({ ["files"] : _ev_0, ["upload_id"] : "receipt_upload", ["extra_headers"] : ({  }) }), ({  }), "uploadFiles"))], [_ev_0], ({  })))), [addEvents, ReflexEvent])
const on_drop_rejected_2fcedbdc0771e7617b4270e2d1ac8cc9 = useCallback(((_ev_0) => (addEvents([(ReflexEvent("_call_function", ({ ["function"] : (() => (refs['__toast']?.["error"]("", ({ ["title"] : "Files not Accepted", ["description"] : _ev_0.map(((osizayzf) => (osizayzf?.["file"]?.["path"]+": "+osizayzf?.["errors"].map(((wnkiegyk) => wnkiegyk?.["message"])).join(", ")))).join("\n\n"), ["closeButton"] : true, ["style"] : ({ ["whiteSpace"] : "pre-line" }) })))), ["callback"] : null }), ({  })))], [_ev_0], ({  })))), [addEvents, ReflexEvent])
const { getRootProps: xdvxrcsn, getInputProps: udaxihhe, isDragActive: bacghqta} = useDropzone(({ ["multiple"] : false, ["accept"] : ({ ["image/*"] : [".png", ".jpg", ".jpeg", ".webp"] }), ["onDrop"] : on_drop_deed11cff8f940d3faa39fb07cb5e8af, ["id"] : "receipt_upload", ["onDropRejected"] : on_drop_rejected_2fcedbdc0771e7617b4270e2d1ac8cc9 }));



  return (
    jsx(Fragment,{},jsx(RadixThemesBox,{className:"rx-Upload",css:({ ["border"] : "1px dashed rgba(255,255,255,0.3)", ["background"] : "rgba(255,255,255,0.05)", ["borderRadius"] : "12px", ["padding"] : "3", ["&:hover"] : ({ ["background"] : "rgba(255,255,255,0.1)" }), ["textAlign"] : "center" }),id:"receipt_upload",ref:ref_receipt_upload,...xdvxrcsn()},jsx("input",{type:"file",...udaxihhe()},),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["padding"] : "6" }),direction:"column",gap:"3"},jsx(RadixThemesText,{as:"p",css:({ ["color"] : "rgba(255,255,255,0.8)" }),size:"2"},"K\u00e9o th\u1ea3 ho\u1eb7c b\u1ea5m \u0111\u1ec3 ch\u1ecdn \u1ea3nh (t\u1ed1i \u0111a 5MB)"))))
  )
}


function Text_9ecd59763de77b8fb54127159dbadfe5 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)



  return (
    jsx(RadixThemesText,{as:"p",css:({ ["color"] : "white", ["fontWeight"] : "bold" }),size:"2"},reflex___state____state__spendee___app_state____app_state.pending_receipt_tx_rx_state_)
  )
}


function Table__body_d59ac31f09b38b32f7cefc941b797744 () {
  const reflex___state____state__spendee___app_state____app_state = useContext(StateContexts.reflex___state____state__spendee___app_state____app_state)
const [addEvents, connectErrors] = useContext(EventLoopContext);



  return (
    jsx(RadixThemesTable.Body,{},Array.prototype.map.call(reflex___state____state__spendee___app_state____app_state.transactions_rx_state_ ?? [],((t_rx_state_,index_fddba5a83ae5282faad1416643c1d679)=>(jsx(RadixThemesTable.Row,{css:({ ["&:hover"] : ({ ["background"] : "rgba(255,255,255,0.1)" }) }),key:index_fddba5a83ae5282faad1416643c1d679},jsx(RadixThemesTable.RowHeaderCell,{css:({ ["color"] : "#fff", ["borderBottom"] : "1px solid rgba(255,255,255,0.05)" })},t_rx_state_?.["transaction_date"]),jsx(RadixThemesTable.Cell,{css:({ ["color"] : "#fff", ["borderBottom"] : "1px solid rgba(255,255,255,0.05)" })},t_rx_state_?.["amount"]),jsx(RadixThemesTable.Cell,{css:({ ["color"] : "#fff", ["borderBottom"] : "1px solid rgba(255,255,255,0.05)" })},t_rx_state_?.["category_name"]),jsx(RadixThemesTable.Cell,{css:({ ["color"] : "#fff", ["borderBottom"] : "1px solid rgba(255,255,255,0.05)" })},t_rx_state_?.["category_type"]),jsx(RadixThemesTable.Cell,{css:({ ["color"] : "#fff", ["borderBottom"] : "1px solid rgba(255,255,255,0.05)" })},t_rx_state_?.["wallet_name"]),jsx(RadixThemesTable.Cell,{css:({ ["color"] : "#fff", ["borderBottom"] : "1px solid rgba(255,255,255,0.05)" })},t_rx_state_?.["note"]),jsx(RadixThemesTable.Cell,{css:({ ["borderBottom"] : "1px solid rgba(255,255,255,0.05)" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",direction:"row",gap:"2"},jsx(RadixThemesButton,{css:({ ["color"] : "#fff", ["borderColor"] : "rgba(255,255,255,0.3)", ["&:hover"] : ({ ["background"] : "rgba(255,255,255,0.1)" }) }),onClick:((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.select_receipt_tx", ({ ["tx_id"] : t_rx_state_?.["id"] }), ({  })))], [_e], ({  })))),size:"1",variant:"outline"},"G\u1eafn bi\u00ean lai"),jsx(RadixThemesButton,{color:"red",onClick:((_e) => (addEvents([(ReflexEvent("reflex___state____state.spendee___app_state____app_state.delete_transaction", ({ ["tx_id"] : t_rx_state_?.["id"] }), ({  })))], [_e], ({  })))),size:"1",variant:"soft"},"X\u00f3a"))))))))
  )
}


export default function Component() {





  return (
    jsx(Fragment,{},jsx(Fragment,{},jsx(Toaster_11b04b7ca7e917be1c8df8032e226c05,{},),jsx(RadixThemesBox,{css:({ ["flex"] : "1", ["marginLeft"] : "260px", ["padding"] : "30px", ["minHeight"] : "100vh", ["background"] : "transparent" })},jsx(RadixThemesBox,{css:({ ["width"] : "260px", ["background"] : "rgba(255, 255, 255, 0.05)", ["backdropFilter"] : "blur(20px)", ["borderRight"] : "1px solid rgba(255, 255, 255, 0.1)", ["padding"] : "24px", ["height"] : "100vh", ["position"] : "fixed", ["top"] : "0", ["left"] : "0", ["zIndex"] : "10", ["display"] : "flex", ["flexDirection"] : "column" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["height"] : "100%", ["width"] : "100%", ["alignItems"] : "start" }),direction:"column",gap:"3"},jsx(RadixThemesBox,{css:({ ["marginBottom"] : "40px", ["width"] : "100%" })},jsx(RadixThemesHeading,{css:({ ["color"] : "#00c6ff", ["fontWeight"] : "bold" }),size:"6"},"Persional Budget"),jsx(RadixThemesText,{as:"p",css:({ ["color"] : "rgba(255, 255, 255, 0.6)" }),size:"2"},"Qu\u1ea3n l\u00fd chi ti\u00eau")),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%" }),direction:"column",gap:"1"},jsx(Link_015ce0ab41dba4ebe292742f7c0f121d,{},),jsx(Link_3e96be4e17ea2bbdc4d7bf09c8e79232,{},),jsx(Link_627970f042d85967af8da2972035db6c,{},),jsx(Link_d2e3928980eb52a8a37ec7bfb0eb9f35,{},),jsx(Link_070b650423df8c43dd8e52b2f03a869f,{},),jsx(Link_e5192abf4002ddd2787b9cc741b4ff17,{},),jsx(Link_6b07ba62b01ccc01416cd0b873a0cf55,{},)),jsx(RadixThemesFlex,{css:({ ["flex"] : 1, ["justifySelf"] : "stretch", ["alignSelf"] : "stretch" })},),jsx(RadixThemesBox,{css:({ ["paddingTop"] : "20px", ["borderTop"] : "1px solid rgba(255, 255, 255, 0.1)", ["marginTop"] : "auto", ["width"] : "100%" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",direction:"row",gap:"2"},jsx(RadixThemesText,{as:"p",css:({ ["color"] : "rgba(255, 255, 255, 0.6)" }),size:"2"},"User:"),jsx(Text_b35035b5c99a7af1fc15d789732b2a04,{},)),jsx(Button_bfebb9393a866e1c162fb1cb3aab554d,{},)))),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["width"] : "100%", ["maxWidth"] : "1280px", ["alignItems"] : "stretch" }),direction:"column",gap:"4"},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["alignItems"] : "center", ["width"] : "100%", ["marginBottom"] : "4" }),direction:"row",justify:"between",gap:"3"},jsx(RadixThemesHeading,{css:({ ["color"] : "#fff", ["fontWeight"] : "bold" }),size:"7"},"Giao d\u1ecbch"),jsx(RadixThemesFlex,{css:({ ["flex"] : 1, ["justifySelf"] : "stretch", ["alignSelf"] : "stretch" })},)),jsx(RadixThemesBox,{css:({ ["background"] : "rgba(255, 255, 255, 0.08)", ["backdropFilter"] : "blur(20px)", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["borderRadius"] : "20px", ["color"] : "#fff", ["boxShadow"] : "0 10px 30px rgba(0,0,0,0.1)", ["padding"] : "20px" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",direction:"column",gap:"3"},jsx(RadixThemesHeading,{css:({ ["color"] : "white" }),size:"4"},"T\u00ecm ki\u1ebfm"),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["flexWrap"] : "wrap", ["alignItems"] : "center" }),direction:"row",gap:"3"},jsx(Select__root_197c58de47d0bccd51b13838e431c9f4,{},),jsx(Select__root_1100c17ae78418d44d464e6296247811,{},),jsx(Debounceinput_d87655a49b96229f89755bfd0201f8e0,{},),jsx(Debounceinput_21b3014abad06d510332490c68c3d825,{},),jsx(Debounceinput_23185f4d99072485dd6a28406d011d47,{},),jsx(Button_e488b015f1f710ed712ec360ed96f030,{},)))),jsx(RadixThemesBox,{css:({ ["background"] : "rgba(255, 255, 255, 0.08)", ["backdropFilter"] : "blur(20px)", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["borderRadius"] : "20px", ["color"] : "#fff", ["boxShadow"] : "0 10px 30px rgba(0,0,0,0.1)", ["padding"] : "20px" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",direction:"column",gap:"3"},jsx(RadixThemesHeading,{css:({ ["color"] : "white" }),size:"4"},"Th\u00eam giao d\u1ecbch"),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",css:({ ["flexWrap"] : "wrap" }),direction:"row",gap:"3"},jsx(Select__root_fbe359ba5017f345c5782b28c6e94b45,{},),jsx(Select__root_d7ee8cb8765f7316db06fa3413448c77,{},),jsx(Debounceinput_d439f7dce5a46004eb88e216b9837a2b,{},),jsx(Debounceinput_aa80047349d2449dc026bd8986f1bd9f,{},)),jsx(Debounceinput_501963f7fbdaaee8d24392028ac289ea,{},),jsx(Button_f53be03ded3b5804b9335f7b6057d6a8,{},))),jsx(RadixThemesBox,{css:({ ["background"] : "rgba(255, 255, 255, 0.08)", ["backdropFilter"] : "blur(20px)", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["borderRadius"] : "20px", ["color"] : "#fff", ["boxShadow"] : "0 10px 30px rgba(0,0,0,0.1)", ["padding"] : "20px" })},jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",direction:"column",gap:"3"},jsx(RadixThemesHeading,{css:({ ["color"] : "white" }),size:"4"},"Bi\u00ean lai (\u1ea3nh)"),jsx(RadixThemesText,{as:"p",css:({ ["color"] : "rgba(255,255,255,0.6)" }),size:"2"},"1) B\u1ea5m \u201cG\u1eafn bi\u00ean lai\u201d tr\u00ean m\u1ed9t d\u00f2ng trong b\u1ea3ng. 2) K\u00e9o \u1ea3nh v\u00e0o v\u00f9ng b\u00ean d\u01b0\u1edbi."),jsx(Comp_dfd0beed9e31430f41446ccb2f708e39,{},),jsx(RadixThemesFlex,{align:"start",className:"rx-Stack",direction:"row",gap:"2"},jsx(RadixThemesText,{as:"p",css:({ ["color"] : "rgba(255,255,255,0.6)" }),size:"2"},"Giao d\u1ecbch \u0111\u00e3 ch\u1ecdn:"),jsx(Text_9ecd59763de77b8fb54127159dbadfe5,{},)))),jsx(RadixThemesBox,{css:({ ["background"] : "rgba(255, 255, 255, 0.08)", ["backdropFilter"] : "blur(20px)", ["border"] : "1px solid rgba(255, 255, 255, 0.1)", ["borderRadius"] : "20px", ["color"] : "#fff", ["boxShadow"] : "0 10px 30px rgba(0,0,0,0.1)", ["padding"] : "0", ["overflow"] : "hidden" })},jsx(RadixThemesTable.Root,{css:({ ["background"] : "transparent", ["color"] : "#fff", ["marginTop"] : "10px", ["width"] : "100%" }),size:"2",variant:"surface"},jsx(RadixThemesTable.Header,{},jsx(RadixThemesTable.Row,{},jsx(RadixThemesTable.ColumnHeaderCell,{css:({ ["color"] : "rgba(255,255,255,0.7)", ["borderBottom"] : "1px solid rgba(255,255,255,0.1)" })},"Ng\u00e0y"),jsx(RadixThemesTable.ColumnHeaderCell,{css:({ ["color"] : "rgba(255,255,255,0.7)", ["borderBottom"] : "1px solid rgba(255,255,255,0.1)" })},"S\u1ed1 ti\u1ec1n"),jsx(RadixThemesTable.ColumnHeaderCell,{css:({ ["color"] : "rgba(255,255,255,0.7)", ["borderBottom"] : "1px solid rgba(255,255,255,0.1)" })},"Danh m\u1ee5c"),jsx(RadixThemesTable.ColumnHeaderCell,{css:({ ["color"] : "rgba(255,255,255,0.7)", ["borderBottom"] : "1px solid rgba(255,255,255,0.1)" })},"Lo\u1ea1i"),jsx(RadixThemesTable.ColumnHeaderCell,{css:({ ["color"] : "rgba(255,255,255,0.7)", ["borderBottom"] : "1px solid rgba(255,255,255,0.1)" })},"V\u00ed"),jsx(RadixThemesTable.ColumnHeaderCell,{css:({ ["color"] : "rgba(255,255,255,0.7)", ["borderBottom"] : "1px solid rgba(255,255,255,0.1)" })},"Ghi ch\u00fa"),jsx(RadixThemesTable.ColumnHeaderCell,{css:({ ["color"] : "rgba(255,255,255,0.7)", ["borderBottom"] : "1px solid rgba(255,255,255,0.1)" })},""))),jsx(Table__body_d59ac31f09b38b32f7cefc941b797744,{},)))))),jsx("title",{},"Giao d\u1ecbch"),jsx("meta",{content:"favicon.ico",property:"og:image"},))
  )
}