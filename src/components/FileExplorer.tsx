import React, { useState } from "react";
import { Folder, FileText, Image, Play, ChevronRight, FolderOpen, Disc } from "lucide-react";

interface MockFile {
  name: string;
  type: "text" | "image" | "exe" | "dir";
  size: string;
  appId?: string;
  contentId?: string;
}

interface MockFolder {
  id: string;
  name: string;
  files: MockFile[];
}

interface FileExplorerProps {
  onLaunchApp: (id: any) => void;
}

export default function FileExplorer({ onLaunchApp }: FileExplorerProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string>("root");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const mockFolders: { [key: string]: MockFolder } = {
    root: {
      id: "root",
      name: "Desktop Local C:\\",
      files: [
        { name: "My Documents", type: "dir", size: "<DIR>", appId: "docs" },
        { name: "Windows Core", type: "dir", size: "<DIR>", appId: "windir" },
        { name: "Config.ini", type: "text", size: "128 KB", appId: "notepad" },
        { name: "SoundCard_Config.sys", type: "text", size: "232 KB", appId: "notepad" }
      ]
    },
    docs: {
      id: "docs",
      name: "C:\\My Documents",
      files: [
        { name: "Gemstone_Journal.txt", type: "text", size: "12 KB", appId: "notepad" },
        { name: "Svalbard_Map.bmp", type: "image", size: "1,440 KB", appId: "paint" },
        { name: "Chiptune_Synthesizer.exe", type: "exe", size: "124 KB", appId: "media_player" }
      ]
    },
    windir: {
      id: "windir",
      name: "C:\\Windows Core",
      files: [
        { name: "Minesweeper_3D.exe", type: "exe", size: "82 KB", appId: "minesweeper" },
        { name: "GemPaint_Studio.exe", type: "exe", size: "532 KB", appId: "paint" },
        { name: "System_Diagnostics.exe", type: "exe", size: "90 KB", appId: "sys_info" }
      ]
    }
  };

  const currentFolder = mockFolders[selectedFolderId] || mockFolders["root"];

  const handleItemClick = (file: MockFile) => {
    if (file.type === "dir" && file.appId) {
      setSelectedFolderId(file.appId);
      setSelectedFileName(null);
    } else {
      setSelectedFileName(file.name);
    }
  };

  const handleItemDoubleClick = (file: MockFile) => {
    if (file.type === "dir" && file.appId) {
      setSelectedFolderId(file.appId);
    } else if (file.appId) {
      onLaunchApp(file.appId as any);
    }
  };

  const getFileIcon = (type: "text" | "image" | "exe" | "dir") => {
    switch (type) {
      case "dir":
        return <Folder size={15} className="text-amber-600 fill-amber-200 shrink-0" />;
      case "text":
        return <FileText size={15} className="text-slate-700 shrink-0" />;
      case "image":
        return <Image size={15} className="text-purple-700 shrink-0" />;
      case "exe":
        return <Play size={15} className="text-blue-900 shrink-0" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-file-explorer">
      {/* Left Navigation Tree Sidebar */}
      <div className="w-full md:w-44 border-b md:border-b-0 md:border-r border-[#808080] p-2 flex flex-col min-h-[100px] md:min-h-0 shrink-0 select-none bg-stone-100">
        <span className="text-[10px] font-bold text-gray-500 mb-1 block">DIRECTORY TREE</span>
        
        <div className="space-y-1">
          <button
            onClick={() => setSelectedFolderId("root")}
            className={`w-full text-left p-1 rounded text-xs flex items-center gap-1.5 ${
              selectedFolderId === "root" ? "bg-[#000080] text-white font-bold" : "hover:bg-gray-200 text-stone-900"
            }`}
          >
            <FolderOpen size={13} className="shrink-0" />
            <span className="truncate">C: Drive</span>
          </button>
          
          <button
            onClick={() => setSelectedFolderId("docs")}
            className={`w-full text-left p-1 pl-4 rounded text-xs flex items-center gap-1.5 ${
              selectedFolderId === "docs" ? "bg-[#000080] text-white font-bold" : "hover:bg-gray-200 text-stone-900"
            }`}
          >
            <ChevronRight size={10} className="shrink-0" />
            <FolderOpen size={13} className="shrink-0 text-amber-700" />
            <span className="truncate">My Document</span>
          </button>

          <button
            onClick={() => setSelectedFolderId("windir")}
            className={`w-full text-left p-1 pl-4 rounded text-xs flex items-center gap-1.5 ${
              selectedFolderId === "windir" ? "bg-[#000080] text-white font-bold" : "hover:bg-gray-200 text-stone-900"
            }`}
          >
            <ChevronRight size={10} className="shrink-0" />
            <FolderOpen size={13} className="shrink-0 text-gray-600" />
            <span className="truncate">Windows Core</span>
          </button>
        </div>
      </div>

      {/* Main File list panel */}
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="text-[11px] font-mono text-gray-600 bg-[#dfdfdf] p-1.5 border border-gray-400 rounded-sm mb-2 shrink-0 select-text truncate">
            Address: <span className="font-semibold text-black">{currentFolder.name}</span>
          </div>

          <div className="flex-1 bg-white retro-border-inset overflow-y-auto select-none">
            <table className="w-full text-left font-mono text-[10.5px] border-collapse">
              <thead>
                <tr className="bg-[#dfdfdf] text-black border-b border-[#808080] font-sans font-bold select-none">
                  <th className="p-1 px-2 border-r border-[#808080]">Name</th>
                  <th className="p-1 px-2 border-r border-[#808080]">Type</th>
                  <th className="p-1 px-2">Size</th>
                </tr>
              </thead>
              <tbody>
                {currentFolder.files.map((file) => {
                  const isSelected = selectedFileName === file.name;
                  return (
                    <tr
                      key={file.name}
                      onClick={() => handleItemClick(file)}
                      onDoubleClick={() => handleItemDoubleClick(file)}
                      className={`border-b border-[#dfdfdf] cursor-default ${
                        isSelected ? "bg-[#000080]/15" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="p-1.5 px-2 font-semibold font-sans flex items-center gap-2 truncate">
                        {getFileIcon(file.type)}
                        <span className="truncate">{file.name}</span>
                      </td>
                      <td className="p-1.5 px-2 capitalize">{file.type}</td>
                      <td className="p-1.5 px-2">{file.size}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-2 border-t border-[#808080] text-[10.5px] text-gray-650 font-mono flex justify-between select-none shrink-0">
          <span className="flex items-center gap-1">
            <Disc size={11} className="text-cyan-800" />
            <span>Volume: FAT32_SYS</span>
          </span>
          <span>Buffer OK</span>
        </div>
      </div>
    </div>
  );
}
