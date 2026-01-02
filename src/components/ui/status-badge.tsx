import { Badge } from "@/components/ui/badge";
import { StatusOS, StatusOSLabels, PrioridadeLabels } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    type: "status" | "prioridade";
    value: string;
    className?: string;
}

const statusStyles: Record<string, string> = {
    aberta: "status-aberta",
    em_andamento: "status-em-andamento",
    pausada: "status-pausada",
    concluida: "status-concluida",
    cancelada: "status-cancelada",
};

const prioridadeStyles: Record<string, string> = {
    baixa: "bg-muted text-muted-foreground",
    media: "bg-info/10 text-info",
    alta: "bg-warning/10 text-warning",
    urgente: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ type, value, className }: StatusBadgeProps) {
    const styles = type === "status" ? statusStyles : prioridadeStyles;
    const labels = type === "status" ? StatusOSLabels : PrioridadeLabels;

    return (
        <Badge className={cn("status-badge font-medium", styles[value], className)}>
            {labels[value] || value}
        </Badge>
    );
}
