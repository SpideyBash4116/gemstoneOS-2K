import React, { useState } from "react";
import { Users, Mail, Phone, MapPin, Search } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
}

export default function AddressBook() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "gemmy",
      name: "Gemmy Core",
      role: "Virtual OS Host",
      email: "gemmy@gemstone.os",
      phone: "DIAL-GEMMY-98",
      location: "Active RAM Heap Sector B",
      bio: "Floating, helpful system assistant. Appreciates diamonds, sapphire clusters, and warm user beeps.",
      avatar: "🤖"
    },
    {
      id: "miner_joe",
      name: "Mineral Joe",
      role: "Svalbard Rig Overseer",
      email: "joe_miner@svalbard.net",
      phone: "+47 981 44 219",
      location: "Glacier Shaft Outpost 3",
      bio: "Lead structural drilling engineer. Veteran of 12 Arctic gemstone blizzards. Always carries a pickaxe.",
      avatar: "⛏️"
    },
    {
      id: "clippy",
      name: "Clippy the Clip",
      role: "Advisor Emeritus",
      email: "clippy@office.spt",
      phone: "1-800-PAPERCLIP",
      location: "Volatile Memory Buffer",
      bio: "Retired document writing specialist. Frequently checks if users are writing mineral proposals.",
      avatar: "📎"
    },
    {
      id: "penguin",
      name: "Svalbard Tux",
      role: "Arctic Mascot",
      email: "tux@svalbard.os",
      phone: "PING-0.0.0.1",
      location: "Frozen Bay Cove",
      bio: "Mascot for the Svalbard mining kernel project. Enjoys small frozen fish and micro-kernel compiling.",
      avatar: "🐧"
    }
  ]);

  const [selectedContactId, setSelectedContactId] = useState<string>("gemmy");
  const [searchTerm, setSearchTerm] = useState("");

  const selectedContact = contacts.find(c => c.id === selectedContactId) || contacts[0];

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden text-black font-sans bg-[#c0c0c0]" id="app-address-book">
      {/* Search & Contacts List Pane */}
      <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-[#808080] p-2 flex flex-col min-h-[120px] md:min-h-0 shrink-0 select-none">
        {/* Search Contact field */}
        <div className="relative mb-2 shrink-0">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="retro-input w-full pl-6 text-xs"
            placeholder="Search contacts..."
          />
          <Search size={10.5} className="absolute left-2 top-2.5 text-gray-500" />
        </div>

        {/* Contacts list */}
        <div className="flex-1 bg-white retro-border-inset overflow-y-auto max-h-[80px] md:max-h-none p-1 flex flex-row md:flex-col gap-1 md:gap-0">
          {filteredContacts.length === 0 ? (
            <div className="text-[10px] text-gray-400 p-2 italic w-full">No matching contacts spotted.</div>
          ) : (
            filteredContacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => setSelectedContactId(contact.id)}
                className={`flex items-center gap-2 p-1.5 cursor-default text-[11px] font-sans truncate shrink-0 w-36 md:w-full border-r md:border-r-0 md:border-b border-[#dfdfdf] ${
                  selectedContactId === contact.id ? "bg-[#000080] text-white" : "hover:bg-gray-100 text-stone-900"
                }`}
              >
                <span className="text-sm shrink-0">{contact.avatar}</span>
                <div className="truncate">
                  <p className="font-semibold truncate">{contact.name}</p>
                  <p className={`text-[9px] truncate ${selectedContactId === contact.id ? "text-gray-300" : "text-gray-500"}`}>{contact.role}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Profile Details Pane */}
      <div className="flex-1 p-3.5 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-3 select-text">
          {/* Avatar and title */}
          <div className="flex items-center gap-4 bg-white p-3.5 retro-border-inset shadow-sm">
            <span className="text-4xl bg-[#dfdfdf] p-2.5 rounded border border-gray-400 select-none">{selectedContact.avatar}</span>
            <div>
              <h3 className="font-extrabold text-[#000080] text-sm tracking-wider">{selectedContact.name}</h3>
              <p className="text-xs text-gray-600 font-mono">{selectedContact.role}</p>
            </div>
          </div>

          {/* Details list */}
          <div className="bg-[#dfdfdf] p-3 text-[11px] font-mono leading-relaxed space-y-1.5 retro-border-inset">
            <div className="flex items-center gap-2">
              <Mail size={12} className="text-blue-900 shrink-0" />
              <span>Email: <a href={`mailto:${selectedContact.email}`} className="underline text-blue-900 hover:text-blue-700">{selectedContact.email}</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={12} className="text-emerald-800 shrink-0" />
              <span>Phone: {selectedContact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={12} className="text-red-750 shrink-0" />
              <span>Grid Node: {selectedContact.location}</span>
            </div>
          </div>

          <div className="p-3 bg-yellow-50 rounded border border-yellow-300 text-xs text-stone-850 leading-relaxed italic">
            &ldquo;{selectedContact.bio}&rdquo;
          </div>
        </div>

        {/* Global actions bar */}
        <div className="pt-3 border-t border-[#808080] text-[10px] text-gray-650 font-mono text-center select-none shrink-0">
          <span>Contacts Database v1.00 • Active Directory</span>
        </div>
      </div>
    </div>
  );
}
