
import React from "react";
import { Badge } from "@/components/ui/badge";
import { AppRole } from "@/hooks/useUserRoles";

interface UserRoleBadgesProps {
  roles: AppRole[];
}

const UserRoleBadges = ({ roles }: UserRoleBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-1">
      {roles.length > 0 ? (
        roles.map((role) => (
          <Badge key={role} variant="secondary">
            {role}
          </Badge>
        ))
      ) : (
        <Badge variant="outline">Nenhum papel</Badge>
      )}
    </div>
  );
};

export default UserRoleBadges;
