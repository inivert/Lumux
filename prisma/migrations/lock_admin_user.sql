-- CreateFunction to prevent admin deletion
CREATE OR REPLACE FUNCTION prevent_admin_deletion()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.email = 'mejiacarlos634@gmail.com' THEN
        RAISE EXCEPTION 'Cannot delete protected admin user';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- CreateTrigger
DROP TRIGGER IF EXISTS protect_admin_user ON "User";
CREATE TRIGGER protect_admin_user
    BEFORE DELETE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION prevent_admin_deletion();

-- Ensure admin user exists
INSERT INTO "User" (id, email, name, role, "hasPassword", "createdAt")
VALUES (
    'admin_protected_user',
    'mejiacarlos634@gmail.com',
    'Carlos',
    'ADMIN',
    false,
    NOW()
)
ON CONFLICT (email) DO UPDATE
SET role = 'ADMIN'
WHERE "User".email = 'mejiacarlos634@gmail.com'; 