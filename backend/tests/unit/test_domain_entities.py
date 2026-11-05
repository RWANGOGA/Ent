"""Domain layer is framework-free: these tests need no database."""
import pytest

from app.domain.entities import Organisation, Placement


def test_placement_has_safe_defaults():
    p = Placement(id="px", title="T", org_id="ox")
    assert p.courses == []
    assert p.docs == []
    assert p.duties == []
    assert p.status == "Open"
    assert p.org is None


def test_entities_are_immutable_value_semantics():
    org = Organisation(id="o1", name="N", type="Company", sector="s", loc="Kampala", seal="NS")
    with pytest.raises(Exception):
        org.name = "mutated"  # frozen dataclass -> raises FrozenInstanceError


def test_placement_can_nest_organisation_read_view():
    org = Organisation(id="o4", name="Lumen Labs", type="Company", sector="Design", loc="Remote", seal="LL")
    p = Placement(id="p1", title="Product Design Intern", org_id="o4", org=org)
    assert p.org is not None
    assert p.org.name == "Lumen Labs"
