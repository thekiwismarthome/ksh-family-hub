"""Sync: lets the KSH Family Hub phone app keep its own copy of the family's data in step with this Home Assistant.

The app asks which parts have changed (a short fingerprint of each), fetches the ones that have, merges them with its own
copy, and sends the merged result back. If something changed here in the meantime the fingerprint no longer matches and the
app simply merges again. Administrators only: the data includes people and their PIN hashes.
"""
