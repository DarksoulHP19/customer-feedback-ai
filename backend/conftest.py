import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))


def pytest_configure(config):
    config.addinivalue_line(
        "markers", "asyncio: mark test as async"
    )
