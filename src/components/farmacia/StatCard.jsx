import { Card, Badge } from "react-bootstrap";

export default function StatCard({ title, value, badge, badgeColor }) {
  return (
    <Card className="shadow-sm border-0 rounded-4">
      <Card.Body>
        <Card.Title className="text-muted">{title}</Card.Title>
        <h2>{value}</h2>

        {badge && (
          <Badge bg={badgeColor} pill>
            {badge}
          </Badge>
        )}
      </Card.Body>
    </Card>
  );
}