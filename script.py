import pygame
import random

# Initialize pygame
pygame.init()

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
FPS = 60

# Initialize the screen
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Margarita's Revenge")

# Load assets
margarita_img = pygame.image.load("pictures/margarita.png")  # Margarita sprite
item_img = pygame.image.load("pictures/vase_nobg.png")  # Replace with various items
book_img = pygame.image.load("pictures/book.png")  # Flying obstacle
background_img = pygame.image.load("pictures/apartment.png")  # Background image

# Scale assets
margarita_img = pygame.transform.scale(margarita_img, (80, 80))
item_img = pygame.transform.scale(item_img, (40, 40))
book_img = pygame.transform.scale(book_img, (30, 30))

# Fonts
font = pygame.font.Font(None, 36)

# Game Variables
clock = pygame.time.Clock()
score = 0
game_over = False

# Margarita class
class Margarita(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = margarita_img
        self.rect = self.image.get_rect()
        self.rect.center = (SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)

    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_UP] and self.rect.top > 0:
            self.rect.y -= 5
        if keys[pygame.K_DOWN] and self.rect.bottom < SCREEN_HEIGHT:
            self.rect.y += 5
        if keys[pygame.K_LEFT] and self.rect.left > 0:
            self.rect.x -= 5
        if keys[pygame.K_RIGHT] and self.rect.right < SCREEN_WIDTH:
            self.rect.x += 5

# Item class
class Item(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = item_img
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)

# Obstacle class
class Book(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = book_img
        self.rect = self.image.get_rect()
        self.rect.center = (x, y)
        self.speed = random.randint(3, 6)

    def update(self):
        self.rect.x -= self.speed
        if self.rect.right < 0:
            self.rect.left = SCREEN_WIDTH

# Initialize sprite groups
all_sprites = pygame.sprite.Group()
items = pygame.sprite.Group()
books = pygame.sprite.Group()

# Create Margarita
margarita = Margarita()
all_sprites.add(margarita)

# Generate items and books
for i in range(5):  # 5 destructible items
    x = random.randint(100, SCREEN_WIDTH - 100)
    y = random.randint(100, SCREEN_HEIGHT - 100)
    item = Item(x, y)
    all_sprites.add(item)
    items.add(item)

for i in range(3):  # 3 flying books
    x = random.randint(SCREEN_WIDTH, SCREEN_WIDTH + 200)
    y = random.randint(0, SCREEN_HEIGHT - 50)
    book = Book(x, y)
    all_sprites.add(book)
    books.add(book)

# Game loop
while not game_over:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            game_over = True

    # Update
    all_sprites.update()

    # Check collisions
    hit_items = pygame.sprite.spritecollide(margarita, items, True)
    for item in hit_items:
        score += 10  # Gain points for destroying items

    hit_books = pygame.sprite.spritecollide(margarita, books, False)
    if hit_books:
        score -= 5  # Lose points for hitting obstacles

    # Draw
    screen.blit(background_img, (0, 0))
    all_sprites.draw(screen)

    # Display score
    score_text = font.render(f"Score: {score}", True, WHITE)
    screen.blit(score_text, (10, 10))

    # Refresh screen
    pygame.display.flip()
    clock.tick(FPS)

# Quit pygame
pygame.quit()
