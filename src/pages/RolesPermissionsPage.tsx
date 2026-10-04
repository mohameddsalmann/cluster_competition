import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { useDemoData } from '../context/DemoDataContext';
import { Check, RotateCcw, ShieldCheck } from 'lucide-react';
import { RoleGroupPermission } from '../types';

export const RolesPermissionsPage: React.FC = () => {
  const { roles, updateRolePermissions } = useDemoData();
  const currentRole = roles[0]; // Super Admin

  const [groups, setGroups] = useState<RoleGroupPermission[]>(currentRole.groups);

  // Toggle individual permission
  const handleTogglePermission = (groupKey: string, permId: string) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.groupKey !== groupKey) return grp;
        return {
          ...grp,
          permissions: grp.permissions.map((p) =>
            p.id === permId ? { ...p, granted: !p.granted } : p
          ),
        };
      })
    );
  };

  // Toggle all permissions within a specific group
  const handleToggleGroup = (groupKey: string) => {
    setGroups((prev) =>
      prev.map((grp) => {
        if (grp.groupKey !== groupKey) return grp;
        const allChecked = grp.permissions.every((p) => p.granted);
        return {
          ...grp,
          permissions: grp.permissions.map((p) => ({ ...p, granted: !allChecked })),
        };
      })
    );
  };

  // Select all / Deselect all across the entire matrix
  const allPermissions = groups.flatMap((g) => g.permissions);
  const isAllSelected = allPermissions.every((p) => p.granted);

  const handleSelectAll = () => {
    const nextState = !isAllSelected;
    setGroups((prev) =>
      prev.map((grp) => ({
        ...grp,
        permissions: grp.permissions.map((p) => ({ ...p, granted: nextState })),
      }))
    );
  };

  const handleSaveChanges = () => {
    updateRolePermissions(currentRole.id, groups);
  };

  const handleReset = () => {
    setGroups(currentRole.groups);
  };

  return (
    <div className="w-full pb-16">
      <PageHeader
        title="Edit Roles"
        breadcrumbs={['Dashboard', 'Roles', 'Edit Roles']}
        actionSlot={
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleSaveChanges}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#0066cc] hover:bg-[#0055b3] rounded shadow-xs transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        }
      />

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-4">
        {/* White Content Card matching Screenshot 1 */}
        <div className="bg-white rounded-lg shadow-sm border border-[#e2e8f0] p-6 space-y-6">
          {/* Top Bar: Select all light blue button */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-5 py-2 text-xs font-semibold bg-[#e1f0fa] hover:bg-[#d0e8f7] text-[#0083cb] rounded-md transition shadow-2xs cursor-pointer"
            >
              {isAllSelected ? 'Deselect all' : 'Select all'}
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-[#0083cb]" />
              <span>
                Role: <strong className="text-slate-800">{currentRole.name}</strong> ({currentRole.userCount} active users)
              </span>
            </div>
          </div>

          {/* Grouped Permissions Matrix matching Screenshot 1 */}
          <div className="space-y-6 divide-y divide-slate-100">
            {groups.map((group) => {
              const allGroupChecked = group.permissions.every((p) => p.granted);
              const someGroupChecked =
                group.permissions.some((p) => p.granted) && !allGroupChecked;

              return (
                <div key={group.groupKey} className="pt-5 first:pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Left Column: Group Heading with Master Checkbox */}
                    <div className="md:col-span-3 flex items-center gap-3">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={allGroupChecked}
                          ref={(el) => {
                            if (el) el.indeterminate = someGroupChecked;
                          }}
                          onChange={() => handleToggleGroup(group.groupKey)}
                          className="w-4 h-4 rounded border-slate-300 text-[#0083cb] focus:ring-[#0083cb] cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          {group.groupLabel}
                        </span>
                      </label>
                    </div>

                    {/* Right Columns: Permission Checkboxes with lowercase labels */}
                    <div className="md:col-span-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                      {group.permissions.map((perm) => (
                        <label
                          key={perm.id}
                          className="flex items-center gap-2 cursor-pointer select-none group"
                        >
                          <input
                            type="checkbox"
                            checked={perm.granted}
                            onChange={() =>
                              handleTogglePermission(group.groupKey, perm.id)
                            }
                            className="w-4 h-4 rounded border-slate-300 text-[#0083cb] focus:ring-[#0083cb] cursor-pointer transition"
                          />
                          <span
                            className={`text-xs transition ${
                              perm.granted
                                ? 'text-slate-700 font-medium'
                                : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                          >
                            {perm.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Save bar */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <span className="text-xs text-slate-500">
              {allPermissions.filter((p) => p.granted).length} of {allPermissions.length} permissions granted
            </span>
            <button
              type="button"
              onClick={handleSaveChanges}
              className="px-6 py-2 text-xs font-semibold text-white bg-[#0066cc] hover:bg-[#0055b3] rounded-md shadow-xs transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
