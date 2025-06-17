
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AppRole } from "@/hooks/useUserRoles";

interface RoleCheckboxesProps {
  userId: string;
  userRoles: AppRole[];
  availableRoles: AppRole[];
  onRoleToggle: (userId: string, role: AppRole, currentRoles: AppRole[]) => void;
  disabled?: boolean;
}

const RoleCheckboxes = ({ 
  userId, 
  userRoles, 
  availableRoles, 
  onRoleToggle, 
  disabled = false 
}: RoleCheckboxesProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {availableRoles.map((role) => {
        const hasRole = userRoles.includes(role);
        return (
          <div key={role} className="flex items-center space-x-2">
            <Checkbox
              id={`${userId}-${role}`}
              checked={hasRole}
              onCheckedChange={() => onRoleToggle(userId, role, userRoles)}
              disabled={disabled}
            />
            <Label 
              htmlFor={`${userId}-${role}`}
              className="text-sm font-medium capitalize cursor-pointer"
            >
              {role}
            </Label>
          </div>
        );
      })}
    </div>
  );
};

export default RoleCheckboxes;
