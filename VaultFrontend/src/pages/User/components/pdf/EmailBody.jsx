import React from "react";
import Tooltip from "../../primitives/Tooltip";
import ReactQuill from "react-quill-new";
import "../../styles/quill.css";
import EditorToolbar, { module1, formats } from "./EditorToolbar";


export function EmailBody(props) {
  
  return (
    <form className="flex flex-col text-base-content text-lg font-normal">
      <div className="m-2 md:m-10 p-3 md:p-10 shadow-md hover:shadow-lg border-[1px] border-indigo-800 rounded-md">
        <label className="text-sm ml-2">
          {("subject")} <Tooltip message={("email-subject")} />
        </label>
        <input
          required
          onInvalid={(e) => e.target.setCustomValidity(("input-required"))}
          onInput={(e) => e.target.setCustomValidity("")}
          value={props.requestSubject}
          onChange={(e) => props.setRequestSubject(e.target.value)}
          placeholder='${senderName} has requested you to sign "${documentName}"'
          className="op-input op-input-bordered op-input-sm focus:outline-none hover:border-base-content w-full text-xs"
        />
        <label className="text-sm ml-2 mt-3">
          {("body")} <Tooltip message={("email-body")} />
        </label>
        <div className="px-1 py-2 w-full focus:outline-none text-xs">
          <EditorToolbar containerId="toolbar1" />
          <ReactQuill
            theme="snow"
            value={props.requestBody}
            placeholder={("email-placeholder")}
            ref={props.editorRef}
            modules={module1}
            formats={formats}
            onChange={props.handleOnchangeRequest}
          />
        </div>
      </div>
    </form>
  );
}
