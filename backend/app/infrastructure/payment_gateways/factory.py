"""Payment gateway factory and configuration."""
from typing import Optional

from app.application.ports import PaymentGateway
from app.infrastructure.payment_gateways.mock_gateway import (
    create_gateway, GATEWAY_CLASSES
)


class PaymentGatewayFactory:
    """Factory for creating and managing payment gateway instances."""
    
    def __init__(self):
        self._gateways: dict[str, PaymentGateway] = {}
        self._configs: dict[str, dict] = {}
    
    def register_gateway(self, gateway_id: str, config: dict = None) -> PaymentGateway:
        """Register and create a gateway instance."""
        gateway = create_gateway(gateway_id, config or {})
        self._gateways[gateway_id] = gateway
        self._configs[gateway_id] = config or {}
        return gateway
    
    def get(self, gateway_id: str) -> PaymentGateway:
        """Get a gateway instance, creating it if needed."""
        if gateway_id not in self._gateways:
            # Try to load config from database
            config = self._configs.get(gateway_id, {})
            self.register_gateway(gateway_id, config)
        return self._gateways[gateway_id]
    
    def get_enabled_gateways(self) -> list[PaymentGateway]:
        """Return all enabled gateway instances."""
        return list(self._gateways.values())
    
    def is_gateway_enabled(self, gateway_id: str) -> bool:
        """Check if a gateway is registered and enabled."""
        return gateway_id in self._gateways


# Global factory instance
_gateway_factory: Optional[PaymentGatewayFactory] = None


def get_gateway_factory() -> PaymentGatewayFactory:
    """Get the global gateway factory instance."""
    global _gateway_factory
    if _gateway_factory is None:
        _gateway_factory = PaymentGatewayFactory()
        # Auto-register default gateways in mock mode
        for gw_id in GATEWAY_CLASSES.keys():
            _gateway_factory.register_gateway(gw_id, {"mode": "mock"})
    return _gateway_factory