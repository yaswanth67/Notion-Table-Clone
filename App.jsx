import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreHorizontal, ChevronDown, Search, Filter, SortAsc, Calendar, User, Tag, CheckSquare, Type, Hash, X } from 'lucide-react';
import './App.css';

const PROPERTY_TYPES = {
  text: { icon: Type, label: 'Text' },
  select: { icon: Tag, label: 'Select' },
  multiSelect: { icon: Tag, label: 'Multi-select' },
  date: { icon: Calendar, label: 'Date' },
  person: { icon: User, label: 'Person' },
};

const SELECT_OPTIONS = {
  status: [
    { id:0, value: 'Set Progress', color: '#e5e7eb' },
    { id: 1, value: 'Not started', color: '#d0d5dd' },
    { id: 2, value: 'In progress', color: '#3b82f6' },
    { id: 3, value: 'Completed', color: '#10b981' },
  ],
  priority: [
    { id:0, value: 'Set Priority', color: '#e5e7eb' },
    { id: 1, value: 'Low', color: '#94a3b8' },
    { id: 2, value: 'Medium', color: '#f59e0b' },
    { id: 3, value: 'High', color: '#ef4444' },
  ],
  tags: [
    { id: 1, value: 'Engineering', color: '#8b5cf6' },
    { id: 2, value: 'Design', color: '#ec4899' },
    { id: 3, value: 'Marketing', color: '#06b6d4' },
    { id: 4, value: 'Product', color: '#10b981' },
  ]
};

function NotionTable() {
  const [data, setData] = useState([
    { 
      id: 1, 
      name: 'Q1 Planning Meeting',
      status: SELECT_OPTIONS.status[1],
      priority: SELECT_OPTIONS.priority[2],
      tags: [SELECT_OPTIONS.tags[0], SELECT_OPTIONS.tags[3]],
      assignee: 'Sarah Chen',
      dueDate: '2024-03-15',
    },
    { 
      id: 2, 
      name: 'Website Redesign',
      status: SELECT_OPTIONS.status[1],
      priority: SELECT_OPTIONS.priority[2],
      tags: [SELECT_OPTIONS.tags[1]],
      assignee: 'Mike Johnson',
      dueDate: '2024-03-22',
    },
    { 
      id: 3, 
      name: 'Customer Feedback Analysis',
      status: SELECT_OPTIONS.status[2],
      priority: SELECT_OPTIONS.priority[1],
      tags: [SELECT_OPTIONS.tags[2], SELECT_OPTIONS.tags[3]],
      assignee: 'Emily Davis',
      dueDate: '2024-03-10',
    },
    { 
      id: 4, 
      name: 'API Documentation Update',
      status: SELECT_OPTIONS.status[0],
      priority: SELECT_OPTIONS.priority[0],
      tags: [SELECT_OPTIONS.tags[0]],
      assignee: 'Alex Kim',
      dueDate: '2024-04-01',
    },
  ]);

  const [columns, setColumns] = useState([
    { id: 'name', name: 'Name', type: 'text', width: 280 },
    { id: 'status', name: 'Status', type: 'select', width: 150 },
    { id: 'priority', name: 'Priority', type: 'select', width: 130 },
    { id: 'tags', name: 'Tags', type: 'multiSelect', width: 200 },
    { id: 'assignee', name: 'Assignee', type: 'person', width: 150 },
    { id: 'dueDate', name: 'Due Date', type: 'date', width: 140 },
  ]);

  const [editingCell, setEditingCell] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [showPropertyMenu, setShowPropertyMenu] = useState(false);

  const handleCellEdit = (rowId, columnId, value) => {
    setData(data.map(row => 
      row.id === rowId ? { ...row, [columnId]: value } : row
    ));
  };

  const addNewRow = () => {
    const newRow = {
      id: Date.now(),
      name: '',
      status: SELECT_OPTIONS.status[0],
      priority: SELECT_OPTIONS.priority[0],
      tags: [],
      assignee: '',
      dueDate: '',
    };
    setData([...data, newRow]);
  };


  return (
    <div className="notion-container">
      <div className="notion-header">
        <div className="notion-title">
          <h1>Project Tasks</h1>
          <button className="icon-btn">
            <MoreHorizontal size={16} />
          </button>
        </div>
        
  
      </div>

      <div className="table-wrapper">
        <table className="notion-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input type="checkbox" />
              </th>
              {columns.map((column, index) => (
                <th 
                  key={column.id}
                  style={{ width: column.width }}
                  className={hoveredColumn === column.id ? 'hovered' : ''}
                  onMouseEnter={() => setHoveredColumn(column.id)}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  <div className="column-header">
                    <span className="column-name">{column.name}</span>
                    <button className="column-menu-btn">
                      <ChevronDown size={12} />
                    </button>
                  </div>
                  <div 
                    className="column-resize-handle"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setResizingColumn(column.id);
                    }}
                  />
                </th>
              ))}
              <th className="add-column-header">
                <button className="add-column-btn" onClick={() => setShowPropertyMenu(!showPropertyMenu)}>
                  <Plus size={14} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr 
                key={row.id}
                className={hoveredRow === row.id ? 'hovered' : ''}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="checkbox-column">
                  <input 
                    type="checkbox"
                    checked={row.completed}
                    onChange={(e) => handleCellEdit(row.id, 'completed', e.target.checked)}
                  />
                </td>
                {columns.map((column) => (
                  <Cell
                    key={`${row.id}-${column.id}`}
                    row={row}
                    column={column}
                    isEditing={editingCell?.rowId === row.id && editingCell?.columnId === column.id}
                    onEdit={(value) => handleCellEdit(row.id, column.id, value)}
                    onStartEdit={() => setEditingCell({ rowId: row.id, columnId: column.id })}
                    onEndEdit={() => setEditingCell(null)}
                  />
                ))}
                <td className="row-actions">
                  {hoveredRow === row.id && (
                    <button className="icon-btn">
                      <MoreHorizontal size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="add-row-btn" onClick={addNewRow}>
        <Plus size={14} />
        New
      </button>
    </div>
  );
}

function Cell({ row, column, isEditing, onEdit, onStartEdit, onEndEdit }) {
  const inputRef = useRef(null);
  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const value = row[column.id];

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const renderCellContent = () => {
    switch (column.type) {
      case 'text':
      case 'person':
        return isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={value || ''}
            onChange={(e) => onEdit(e.target.value)}
            onBlur={onEndEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onEndEdit();
              if (e.key === 'Escape') onEndEdit();
            }}
            className="cell-input"
          />
        ) : (
          <div className="cell-text" onClick={onStartEdit}>
            {value || <span className="empty-cell">Empty</span>}
          </div>
        );

      case 'select':
        return (
          <div className="select-cell" onClick={() => setShowSelectMenu(!showSelectMenu)}>
            {value && (
              <span className="select-tag" style={{ backgroundColor: value.color }}>
                {value.value}
              </span>
            )}
            {showSelectMenu && (
              <SelectMenu
                options={SELECT_OPTIONS[column.id] || SELECT_OPTIONS.status}
                onSelect={(option) => {
                  onEdit(option);
                  setShowSelectMenu(false);
                }}
                onClose={() => setShowSelectMenu(false)}
              />
            )}
          </div>
        );

      case 'multiSelect':
        return (
          <div className="multi-select-cell" onClick={() => setShowSelectMenu(!showSelectMenu)}>
            {value && value.length > 0 ? (
              <div className="tag-container">
                {value.map((tag) => (
                  <span key={tag.id} className="select-tag" style={{ backgroundColor: tag.color }}>
                    {tag.value}
                    <button 
                      className="tag-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(value.filter(t => t.id !== tag.id));
                      }}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="empty-cell">Empty</span>
            )}
            {showSelectMenu && (
              <SelectMenu
                options={SELECT_OPTIONS.tags}
                selectedOptions={value || []}
                multiSelect
                onSelect={(option) => {
                  const currentTags = value || [];
                  const isSelected = currentTags.some(t => t.id === option.id);
                  if (isSelected) {
                    onEdit(currentTags.filter(t => t.id !== option.id));
                  } else {
                    onEdit([...currentTags, option]);
                  }
                }}
                onClose={() => setShowSelectMenu(false)}
              />
            )}
          </div>
        );

      case 'date':
        return isEditing ? (
          <input
            ref={inputRef}
            type="date"
            value={value || ''}
            onChange={(e) => onEdit(e.target.value)}
            onBlur={onEndEdit}
            className="cell-input"
          />
        ) : (
          <div className="cell-text date-cell" onClick={onStartEdit}>
            {value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : <span className="empty-cell">Empty</span>}
          </div>
        );

     
    }
  };

  return <td className="table-cell">{renderCellContent()}</td>;
}

function SelectMenu({ options, selectedOptions = [], multiSelect = false, onSelect, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="select-menu" ref={menuRef}>
      {options.map((option) => {
        const isSelected = multiSelect && selectedOptions.some(s => s.id === option.id);
        return (
          <div
            key={option.id}
            className={`select-option ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(option)}
          >
            {multiSelect && (
              <input type="checkbox" checked={isSelected} readOnly />
            )}
            <span className="select-tag" style={{ backgroundColor: option.color }}>
              {option.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default NotionTable;
